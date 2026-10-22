<?php

namespace App\Http\Controllers;

use App\Models\Room;

class RoomController extends Controller
{
    public function __invoke()
    {
        $rooms = Room::all();

        return response()->json([
            'data' => $rooms,
        ]);
    }
}
