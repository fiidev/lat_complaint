<?php

namespace App\Http\Controllers;

use App\Models\Complaint;
use App\Models\ComplaintCategory;
use App\Models\Room;
use App\Models\Ticket;
use Illuminate\Support\Carbon;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    private function getDateRange(Request $request)
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        return [
            Carbon::parse($request->start_date)->startOfDay(),
            Carbon::parse($request->end_date)->endOfDay(),
        ];
    }

    public function summary(Request $request)
    {
        [$start, $end] = $this->getDateRange($request);

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
        [$start, $end] = $this->getDateRange($request);

        $categories = ComplaintCategory::select(['id', 'name', 'description'])
            ->withCount(['complaints' => fn($q) => $q->whereBetween('created_at', [$start, $end])])->get();

        return response()->json([
            'message' => 'Complaint report by category generated successfully.',
            'data' => $categories,
        ]);
    }

    public function byRoom(Request $request)
    {
        [$start, $end] = $this->getDateRange($request);

        $rooms = Room::select(['id', 'name', 'building', 'room_number', 'is_active', 'complaints_count'])
            ->withCount(['complaints' => fn($q) => $q->whereBetween('created_at', [$start, $end])])->get();

        return response()->json([
            'message' => 'Complaint report by room generated successfully.',
            'data' => $rooms
        ]);
    }

    public function trends(Request $request)
    {
        $request->validate([
            'group_by' => 'nullable|in:day,month',
        ]);

        [$start, $end] = $this->getDateRange($request);
        $format = ($request->group_by === 'month') ? 'Y-m' : 'Y-m-d';

        $complaints = Complaint::whereBetween('created_at', [$start, $end])
            ->get(['id', 'created_at']);

        $trends = $complaints->countBy(fn($item) => $item->created_at->format($format));

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
        [$start, $end] = $this->getDateRange($request);

        $tickets = Ticket::whereHas('complaint', fn($q) => $q->whereBetween('created_at', [$start, $end]))->get();

        $resolved = $tickets->where('status', 'resolved')->filter(fn($t) => $t->resolved_at !== null);

        $avgMinutes = $resolved->isEmpty()
            ? 0
            : round($resolved->avg(fn($t) => $t->created_at->diffInMinutes($t->resolved_at)), 1);

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
