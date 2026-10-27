<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    public function index(Request $request)
    {
        $rooms = Room::when($request->has('active'), fn($q) => $q->where('is_active', true))
            ->get();

        return response()->json([
            'message' => 'Rooms retrieved successfully.',
            'data' => $rooms,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'building' => 'required|string|max:255',
            'room_number' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'is_active' => 'boolean',
        ]);

        $room = Room::create($validated);

        return response()->json([
            'message' => 'Room created successfully.',
            'data' => $room,
        ], 201);
    }

    public function show(Room $room)
    {
        return response()->json([
            'message' => 'Room retrieved successfully.',
            'data' => $room,
        ]);
    }

    public function update(Request $request, Room $room)
    {
        $validated = $request->validate([
            'building' => 'sometimes|required|string|max:255',
            'room_number' => 'sometimes|required|string|max:255',
            'name' => 'sometimes|required|string|max:255',
            'is_active' => 'boolean',
        ]);

        $room->update($validated);

        return response()->json([
            'message' => 'Room updated successfully.',
            'data' => $room,
        ]);
    }

    public function destroy(Room $room)
    {
        $room->delete();

        return response()->json([
            'message' => 'Room deleted successfully.',
        ]);
    }
}
