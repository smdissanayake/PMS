<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Carbon\Carbon;

class ForgotPasswordController extends Controller
{
    private $adminEmail = 'nethmayasith2001@gmail.com';

    // Step 1: Send code to admin email
    public function sendCode(Request $request)
    {
        $email = $this->adminEmail;
        $user = User::where('email', $email)->first();
        if (!$user) {
            return response()->json(['message' => 'Admin user not found.'], 404);
        }
        $code = rand(100000, 999999);
        // Store code in password_resets table
        DB::table('password_resets')->updateOrInsert(
            ['email' => $email],
            ['code' => $code, 'created_at' => Carbon::now()]
        );
        // Send code to email
        Mail::raw("Your password reset code is: $code", function ($message) use ($email) {
            $message->to($email)->subject('Password Reset Code');
        });
        return response()->json(['message' => 'Reset code sent to admin email.']);
    }

    // Step 2: Verify code
    public function verifyCode(Request $request)
    {
        $email = $this->adminEmail;
        $request->validate([
            'code' => 'required|string',
        ]);
        $record = DB::table('password_resets')
            ->where('email', $email)
            ->where('code', $request->code)
            ->first();
        if (!$record) {
            return response()->json(['message' => 'Invalid code.'], 422);
        }
        return response()->json(['message' => 'Code verified.']);
    }

    // Step 3: Reset password
    public function resetPassword(Request $request)
    {
        $email = $this->adminEmail;
        $request->validate([
            'code' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);
        $record = DB::table('password_resets')
            ->where('email', $email)
            ->where('code', $request->code)
            ->first();
        if (!$record) {
            return response()->json(['message' => 'Invalid code.'], 422);
        }
        // Update user password
        $user = User::where('email', $email)->first();
        $user->password = Hash::make($request->password);
        $user->save();
        // Delete the reset record
        DB::table('password_resets')->where('email', $email)->delete();
        return response()->json(['message' => 'Password reset successful.']);
    }
}
