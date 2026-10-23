<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $req)
    {
        $v = $req->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string',
        ]);

        $user = User::create([
            'name' => $v['name'],
            'email' => $v['email'],
            'password' => $v['password'],
            'role' => $v['role'] ?? 'student',
        ]);

        return response()->json([
            'message' => 'User registered successfully.',
            'data' => $user,
        ], 201);
    }

    public function login(Request $req)
    {
        $v = $req->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::firstWhere('email', $v['email']);

        if (! $user || ! Hash::check($v['password'], $user->password)) {
            return response()->json([
                'message' => 'Invalid credentials.',
            ], 401);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'message' => 'User registered successfully.',
            'data' => [
                'user' => $user,
                'token' => $token,
            ],
        ], 201);
    }

    public function logout(Request $req)
    {
        $req->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully.',
        ]);
    }
}
