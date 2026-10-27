<?php

namespace App\Http\Controllers;

use App\Models\Complaint;
use Illuminate\Http\Request;

class ComplaintController extends Controller
{
    public function store(Request $request)
    {
        $v = $request->validate([
            'room_id' => 'required|exists:rooms,id',
            'category_id' => 'required|exists:complaint_categories,id',
            'title' => 'required|string|max:150',
            'description' => 'required|string',
            'evidence_image' => 'nullable|mimes:jpeg,webp,png|max:5120',
        ]);

        $imagePath = $request->hasFile('evidence_image')
            ? $request->file('evidence_image')->store('complaints', 'public')
            : null;

        $complaint = Complaint::create([
            'user_id' => $request->user()->id,
            'room_id' => $v['room_id'],
            'category_id' => $v['category_id'],
            'title' => $v['title'],
            'description' => $v['description'],
            'evidence_image' => $imagePath,
            'status' => 'submitted',
        ]);

        return response()->json([
            'message' => 'Complaint submitted successfully.',
            'data' => $complaint->only(['id', 'title', 'status', 'evidence_image']),
        ], 201);
    }

    public function my(Request $request)
    {
        $complaints = Complaint::with(['room', 'category', 'ticket'])
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json([
            'message' => 'Own complaints retrieved successfully.',
            'data' => $complaints,
        ]);
    }

    public function show(Request $request, $id)
    {
        $complaint = Complaint::with(['room', 'category', 'ticket'])->findOrFail($id);
        $user = $request->user();

        if ($user->role !== 'admin' && $complaint->user_id !== $user->id) {
            return response()->json([
                'message' => 'You are not authorized to view this complaint.',
            ], 403);
        }

        return response()->json([
            'message' => 'Complaint retrieved successfully.',
            'data' => $complaint,
        ]);
    }

    public function adminIndex(Request $request)
    {
        $query = Complaint::with(['user:id,name,email,role', 'room', 'category', 'ticket']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('room_id')) {
            $query->where('room_id', $request->room_id);
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        $complaints = $query->latest()->get();

        return response()->json([
            'message' => 'All complaints retrieved successfully.',
            'data' => $complaints,
        ]);
    }

    public function accept($id)
    {
        $complaint = Complaint::findOrFail($id);

        if ($complaint->status !== 'submitted') {
            return response()->json([
                'message' => 'Only submitted complaints can be accepted.',
            ], 409);
        }

        $complaint->update(['status' => 'accepted']);

        return response()->json([
            'message' => 'Complaint accepted successfully.',
            'data' => $complaint->only(['id', 'status']),
        ]);
    }

    public function reject(Request $request, $id)
    {
        $data = $request->validate([
            'rejection_reason' => 'required|string',
        ]);

        $complaint = Complaint::findOrFail($id);

        if ($complaint->status !== 'submitted') {
            return response()->json(['message' => 'Only submitted complaints can be rejected.'], 409);
        }

        $complaint->update([
            'status' => 'rejected',
            'rejection_reason' => $data['rejection_reason'],
        ]);

        return response()->json([
            'message' => 'Complaint rejected successfully.',
            'data' => $complaint->only(['id', 'status', 'rejection_reason']),
        ]);
    }
}
