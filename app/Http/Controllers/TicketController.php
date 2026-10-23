<?php

namespace App\Http\Controllers;

use App\Models\Complaint;
use App\Models\Ticket;
use App\Models\TicketHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TicketController extends Controller
{
    public function store(Request $request, $id)
    {
        $v = $request->validate([
            'assigned_to' => 'required|exists:users,id,role,staff',
            'priority' => 'required|in:low,medium,high',
            'note' => 'nullable|string',
        ]);

        $complaint = Complaint::with('ticket')->findOrFail($id);

        if ($complaint->status !== 'accepted') {
            return response()->json([
                'message' => 'Ticket can only be created for an accepted complaint.',
            ], 409);
        }

        if ($complaint->ticket) {
            return response()->json(['message' => 'Ticket already exists for this complaint.'], 409);
        }

        $ticket = DB::transaction(function () use ($complaint, $v, $request) {
            $ticket = Ticket::create([
                'complaint_id' => $complaint->id,
                'assigned_to' => $v['assigned_to'],
                'created_by' => $request->user()->id,
                'ticket_number' => 'MOK-TKT-'.now()->format('Y').'-'.mt_rand(1000, 99999),
                'priority' => $v['priority'],
                'status' => 'open',
            ]);

            TicketHistory::create([
                'ticket_id' => $ticket->id,
                'user_id' => $request->user()->id,
                'old_status' => null,
                'new_status' => 'open',
                'note' => $v['note'] ?? 'Ticket created and assigned.',
            ]);

            return $ticket;
        });

        return response()->json([
            'message' => 'Ticket created and assigned successfully.',
            'data' => $ticket->only(['id', 'ticket_number', 'complaint_id', 'assigned_to', 'priority', 'status']),
        ], 201);
    }

    public function myTickets(Request $request)
    {
        $tickets = Ticket::with(['complaint.room', 'complaint.category', 'complaint.user:id,name,email'])
            ->where('assigned_to', $request->user()->id)
            ->latest()
            ->get();

        return response()->json([
            'message' => 'Assigned tickets retrieved successfully.',
            'data' => $tickets,
        ]);
    }

    public function show(Request $request, $id)
    {
        $ticket = Ticket::with([
            'complaint.room',
            'complaint.category',
            'complaint.user:id,name,email',
            'assignee:id,name,email',
            'creator:id,name,email',
            'histories.user:id,name,role',
        ])->findOrFail($id);

        $user = $request->user();

        $isAuthorized = $user->role === 'admin'
            || $ticket->assigned_to === $user->id
            || $ticket->complaint->user_id === $user->id;

        if (! $isAuthorized) {
            return response()->json([
                'message' => 'You are not authorized to view this ticket.',
            ], 403);
        }

        return response()->json([
            'message' => 'Ticket retrieved successfully.',
            'data' => $ticket,
        ]);
    }

    public function start(Request $request, $id)
    {
        $data = $request->validate(['note' => 'nullable|string']);
        $ticket = Ticket::findOrFail($id);

        if ($ticket->assigned_to !== $request->user()->id) {
            return response()->json([
                'message' => 'Only the assigned staff can start this ticket.',
            ], 403);
        }

        if ($ticket->status !== 'open') {
            return response()->json(['message' => 'Ticket can only be started from open status.'], 409);
        }

        DB::transaction(function () use ($ticket, $data, $request) {
            $oldStatus = $ticket->status;
            $ticket->update(['status' => 'in_progress']);

            TicketHistory::create([
                'ticket_id' => $ticket->id,
                'user_id' => $request->user()->id,
                'old_status' => $oldStatus,
                'new_status' => 'in_progress',
                'note' => $data['note'] ?? 'Work started.',
            ]);
        });

        return response()->json([
            'message' => 'Ticket moved to in_progress.',
            'data' => $ticket->only(['id', 'status']),
        ]);
    }

    public function resolve(Request $request, $id)
    {
        $data = $request->validate(['resolution_notes' => 'required|string']);
        $ticket = Ticket::findOrFail($id);

        if ($ticket->assigned_to !== $request->user()->id) {
            return response()->json([
                'message' => 'Only the assigned staff can resolve this ticket.',
            ], 403);
        }

        if ($ticket->status !== 'in_progress') {
            return response()->json([
                'message' => 'Ticket must be in_progress before resolving.',
            ], 409);
        }

        $resolvedAt = now();

        DB::transaction(function () use ($ticket, $data, $request, $resolvedAt) {
            $oldStatus = $ticket->status;
            $ticket->update([
                'status' => 'resolved',
                'resolution_notes' => $data['resolution_notes'],
                'resolved_at' => $resolvedAt,
            ]);

            TicketHistory::create([
                'ticket_id' => $ticket->id,
                'user_id' => $request->user()->id,
                'old_status' => $oldStatus,
                'new_status' => 'resolved',
                'note' => $data['resolution_notes'],
            ]);
        });

        return response()->json([
            'message' => 'Ticket resolved successfully.',
            'data' => [
                'id' => $ticket->id,
                'status' => $ticket->status,
                'resolution_notes' => $ticket->resolution_notes,
                'resolved_at' => $resolvedAt->toIso8601String(),
            ],
        ]);
    }

    public function history(Request $req, $id)
    {
        $v = $req->validate([
            'note' => 'required|string',
        ]);

        $ticket = Ticket::findOrFail($id);
        $user = $req->user();

        if ($user->role !== 'admin' && $ticket->assigned_to !== $user->id) {
            return response()->json([
                'message' => 'Only the assigned staff and admin can add progress notes to this ticket.',
            ], 403);
        }

        $history = TicketHistory::create([
            'ticket_id' => $ticket->id,
            'user_id' => $user->id,
            'note' => $v['note'],
            'old_status' => null,
            'new_status' => null,
        ]);

        return response()->json([
            'message' => 'Progress note added successfully.',
            'data' => [
                'ticket_id' => $ticket->id,
                'user_id' => $user->id,
                'note' => $history->note,
            ],
        ], 201);
    }

    public function getHistories(Request $request, $id)
    {
        $ticket = Ticket::with('complaint')->findOrFail($id);
        $user = $request->user();

        $isAuthorized = $user->role === 'admin'
            || $ticket->assigned_to === $user->id
            || $ticket->complaint->user_id === $user->id;

        if (! $isAuthorized) {
            return response()->json([
                'message' => 'You are not authorized to view this ticket history.',
            ], 403);
        }

        $histories = $ticket->histories()
            ->with('user:id,name,role')
            ->latest()
            ->get();

        return response()->json([
            'message' => 'Ticket histories retrieved successfully.',
            'data' => $histories,
        ]);
    }
}
