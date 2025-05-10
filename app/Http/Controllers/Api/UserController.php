<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;  // ✅ Import User model
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
    {
        // Fetch all users
        $users = User::all();

        // Return as JSON
        return response()->json($users);
    }

    public function store(Request $request)
    {
        // Validate the request
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        // Create a new user
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
        ]);

        // Return the created user as JSON
        return response()->json($user, 201);
    }
}
