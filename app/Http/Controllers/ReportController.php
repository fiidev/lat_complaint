<?php

namespace App\Http\Controllers;

use App\Models\Complaint;
use App\Models\ComplaintCategory;
use App\Models\Room;
use App\Models\Ticket;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function summary(Request $request)
    {
        $request->validate([
            'start_date' => 'required|date_format:Y-m-d',
            'end_date' => 'required|date_format:Y-m-d|after_or_equal:start_date',
        ]);

        $start = $request->start_date.' 00:00:00';
        $end = $request->end_date.' 23:59:59';

        $complaints = Complaint::with('ticket')
            ->whereBetween('created_at', [$start, $end])
            ->get();

        return response()->json([
            'message' => 'Complaint report generated successfully.',
            'data' => [
                'period' => [
                    'start_date' => $request->start_date,
                    'end_date' => $request->end_date,
                ],
                'total_complaints' => $complaints->count(),
                'by_status' => [
                    'submitted' => $complaints->where('status', 'submitted')->count(),
                    'accepted' => $complaints->where('status', 'accepted')->count(),
                    'rejected' => $complaints->where('status', 'rejected')->count(),
                ],
                'tickets' => [
                    'open' => $complaints->where('ticket.status', 'open')->count(),
                    'in_progress' => $complaints->where('ticket.status', 'in_progress')->count(),
                    'resolved' => $complaints->where('ticket.status', 'resolved')->count(),
                ],
            ],
        ]);
    }

    public function byCategory(Request $request)
    {
        $request->validate([
            'start_date' => 'required|date_format:Y-m-d',
            'end_date' => 'required|date_format:Y-m-d|after_or_equal:start_date',
        ]);

        $start = $request->start_date.' 00:00:00';
        $end = $request->end_date.' 23:59:59';

        $categories = ComplaintCategory::withCount(['complaints' => function ($q) use ($start, $end) {
            $q->whereBetween('created_at', [$start, $end]);
        }])->get();

        return response()->json([
            'message' => 'Complaint report by category generated successfully.',
            'data' => $categories->map(fn ($c) => [
                'id' => $c->id,
                'name' => $c->name,
                'total_complaints' => $c->complaints_count,
            ]),
        ]);
    }

    public function byRoom(Request $request)
    {
        $request->validate([
            'start_date' => 'required|date_format:Y-m-d',
            'end_date' => 'required|date_format:Y-m-d|after_or_equal:start_date',
        ]);

        $start = $request->start_date.' 00:00:00';
        $end = $request->end_date.' 23:59:59';

        $rooms = Room::withCount(['complaints' => function ($q) use ($start, $end) {
            $q->whereBetween('created_at', [$start, $end]);
        }])->get();

        return response()->json([
            'message' => 'Complaint report by room generated successfully.',
            'data' => $rooms->map(fn ($r) => [
                'id' => $r->id,
                'building' => $r->building,
                'room_number' => $r->room_number,
                'name' => $r->name,
                'total_complaints' => $r->complaints_count,
            ]),
        ]);
    }

    public function trends(Request $request)
    {
        $request->validate([
            'start_date' => 'required|date_format:Y-m-d',
            'end_date' => 'required|date_format:Y-m-d|after_or_equal:start_date',
            'group_by' => 'nullable|in:day,month',
        ]);

        $start = $request->start_date.' 00:00:00';
        $end = $request->end_date.' 23:59:59';
        $format = ($request->group_by === 'month') ? 'Y-m' : 'Y-m-d';

        $complaints = Complaint::whereBetween('created_at', [$start, $end])
            ->get(['id', 'created_at']);

        $trends = $complaints->groupBy(fn ($item) => $item->created_at->format($format))
            ->map(fn ($group) => $group->count());

        return response()->json([
            'message' => 'Complaint trends report generated successfully.',
            'data' => [
                'group_by' => $request->group_by ?? 'day',
                'trends' => $trends,
            ],
        ]);
    }

    public function resolution(Request $request)
    {
        $request->validate([
            'start_date' => 'required|date_format:Y-m-d',
            'end_date' => 'required|date_format:Y-m-d|after_or_equal:start_date',
        ]);

        $start = $request->start_date.' 00:00:00';
        $end = $request->end_date.' 23:59:59';

        $tickets = Ticket::whereHas('complaint', function ($q) use ($start, $end) {
            $q->whereBetween('created_at', [$start, $end]);
        })->get();

        $resolved = $tickets->where('status', 'resolved')->filter(fn ($t) => $t->resolved_at);

        $avgMinutes = $resolved->count() > 0
            ? round($resolved->avg(fn ($t) => $t->created_at->diffInMinutes($t->resolved_at)), 1)
            : 0;

        return response()->json([
            'message' => 'Ticket resolution report generated successfully.',
            'data' => [
                'tickets' => [
                    'open' => $tickets->where('status', 'open')->count(),
                    'in_progress' => $tickets->where('status', 'in_progress')->count(),
                    'resolved' => $tickets->where('status', 'resolved')->count(),
                ],
                'metrics' => [
                    'resolved_count' => $resolved->count(),
                    'avg_resolution_time_minutes' => $avgMinutes,
                    'avg_resolution_time_hours' => round($avgMinutes / 60, 2),
                ],
            ],
        ]);
    }
}
