<?php

namespace App\Http\Controllers;

use App\Models\Room;

class RoomController extends Controller
{
    public function __invoke()
    {
        $rooms = Room::where('is_active', true)->get();

        return response()->json([
            'message' => 'Rooms retrieved successfully.',
            'data' => $rooms,
        ]);
    }
}
