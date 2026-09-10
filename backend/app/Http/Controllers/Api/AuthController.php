<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Admin Login and Token issuance
     */
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'username' => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        $loginInput = trim($request->input('username'));

        // Allow login via username or email
        $user = User::where('username', $loginInput)
            ->orWhere('email', $loginInput)
            ->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'अमान्य व्यवस्थापक उपयोगकर्ता नाम या पासवर्ड (Invalid username or password).',
            ], 401);
        }

        if (!$user->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'यह व्यवस्थापक खाता निष्क्रिय कर दिया गया है (Admin account is inactive).',
            ], 403);
        }

        // Update last login
        $user->update(['last_login_at' => now()]);

        // Generate Sanctum token
        $token = $user->createToken('admin_token', ['*'], now()->addDays(7))->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'व्यवस्थापक लॉगिन सफल (Admin login successful).',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'username' => $user->username,
                'email' => $user->email,
                'role' => $user->role,
            ],
        ]);
    }

    /**
     * Logout and revoke current token
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()?->currentAccessToken()?->delete();

        return response()->json([
            'success' => true,
            'message' => 'सफलतापूर्वक लॉगआउट किया गया (Logged out successfully).',
        ]);
    }

    /**
     * Get Authenticated Admin Info
     */
    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'user' => $request->user(),
        ]);
    }

    /**
     * Change Admin Password in Database
     */
    public function changePassword(Request $request): JsonResponse
    {
        $request->validate([
            'current_password' => ['required', 'string'],
            'new_password' => ['required', 'string', 'min:6'],
        ]);

        $user = $request->user();

        if (!$user) {
            $user = User::where('role', 'SUPER_ADMIN')->orWhere('username', 'admin')->first();
        }

        if (!$user || !Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'वर्तमान पासवर्ड गलत है! (Current password is incorrect).',
            ], 422);
        }

        $user->update([
            'password' => Hash::make($request->new_password),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'पासवर्ड सफलतापूर्वक बदल दिया गया है (Password updated successfully in database).',
        ]);
    }
}

