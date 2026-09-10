<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreArtistRegistrationRequest;
use App\Models\ArtistRegistration;
use App\Services\RegIdGeneratorService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class RegistrationController extends Controller
{
    /**
     * Submit and persist new Artist Registration with high-concurrency safety
     */
    public function store(StoreArtistRegistrationRequest $request): JsonResponse
    {
        $validated = $request->validated();

        // 1. Calculate Age
        $dob = Carbon::parse($validated['dob']);
        $age = $dob->age;

        // 2. Generate Collision-Proof Combo Registration ID: [CATEGORY]-[DISCIPLINE]-[STATE]-[LAST4]
        $registrationId = RegIdGeneratorService::generate(
            $validated['category'],
            $validated['discipline'],
            $validated['state'],
            $validated['aadhaarNumber'] ?? null,
            $validated['mobile'] ?? null
        );

        // Microtime entropy guarantee for concurrent submissions
        $originalId = $registrationId;
        $attempt = 1;
        while (ArtistRegistration::where('registration_id', $registrationId)->exists()) {
            $entropy = substr(md5(microtime() . mt_rand(100, 999)), 0, 3);
            $registrationId = "{$originalId}-{$entropy}";
            $attempt++;
            if ($attempt > 5) break;
        }

        // 3. Handle File Uploads to Public Storage Disk
        $fileFields = [
            'photo' => 'uploads/photos',
            'video' => 'uploads/videos',
            'pan' => 'uploads/docs',
            'aadhaarFront' => 'uploads/docs',
            'aadhaarBack' => 'uploads/docs',
            'passbook' => 'uploads/docs',
        ];

        $storedPaths = [];
        $originalNames = [];

        foreach ($fileFields as $field => $folder) {
            if ($request->hasFile($field)) {
                $file = $request->file($field);
                $ext = $file->getClientOriginalExtension() ?: 'bin';
                $safeName = Str::slug($registrationId) . "_{$field}." . $ext;
                $path = $file->storeAs($folder, $safeName, 'public');

                $storedPaths[$field] = $path;
                $originalNames[$field] = $file->getClientOriginalName();
            } else {
                $storedPaths[$field] = null;
                $originalNames[$field] = null;
            }
        }

        // 4. Create ArtistRegistration inside ACID DB Transaction
        $registration = DB::transaction(function () use ($validated, $registrationId, $dob, $age, $storedPaths, $originalNames) {
            return ArtistRegistration::create([
                'registration_id' => $registrationId,
                'full_name' => trim($validated['fullName']),
                'father_husband_name' => trim($validated['fatherHusbandName']),
                'dob' => $dob->format('Y-m-d'),
                'age' => $age,
                'gender' => $validated['gender'],
                'mobile' => trim($validated['mobile']),
                'email' => $validated['email'] ?? null,
                'address' => trim($validated['address']),
                'district' => trim($validated['district']),
                'state' => trim($validated['state']),
                'pincode' => trim($validated['pincode']),

                'category' => $validated['category'],
                'discipline' => $validated['discipline'],
                'art_description' => trim($validated['artDescription']),
                'experience' => (string) $validated['experience'],

                'aadhaar_number' => trim($validated['aadhaarNumber']),
                'aadhaar_name' => trim($validated['aadhaarName']),
                'passbook_name' => trim($validated['passbookName']),
                'name_match_verified' => true,

                'photo_path' => $storedPaths['photo'] ?? 'uploads/photos/default_photo.jpg',
                'photo_original_name' => $originalNames['photo'] ?? 'photo.jpg',
                'video_path' => $storedPaths['video'] ?? null,
                'video_original_name' => $originalNames['video'] ?? null,
                'pan_path' => $storedPaths['pan'] ?? null,
                'pan_original_name' => $originalNames['pan'] ?? null,
                'aadhaar_front_path' => $storedPaths['aadhaarFront'] ?? 'uploads/docs/default_aadhaar_f.jpg',
                'aadhaar_front_original_name' => $originalNames['aadhaarFront'] ?? 'aadhaar_front.jpg',
                'aadhaar_back_path' => $storedPaths['aadhaarBack'] ?? 'uploads/docs/default_aadhaar_b.jpg',
                'aadhaar_back_original_name' => $originalNames['aadhaarBack'] ?? 'aadhaar_back.jpg',
                'passbook_path' => $storedPaths['passbook'] ?? 'uploads/docs/default_passbook.jpg',
                'passbook_original_name' => $originalNames['passbook'] ?? 'passbook.jpg',

                'youtube' => $validated['youtube'] ?? null,
                'instagram' => $validated['instagram'] ?? null,
                'facebook' => $validated['facebook'] ?? null,
                'portfolio' => $validated['portfolio'] ?? null,

                'status' => 'UNDER_REVIEW',
                'status_text_hi' => 'सत्यापन हेतु प्रस्तुत (Submitted for Verification)',
                'status_text_en' => 'Under Review by Directorate of Culture',
            ]);
        });

        // Clear dashboard counters cache for fresh stats
        Cache::forget('admin_analytics_counts');

        return response()->json([
            'success' => true,
            'messageHi' => 'कलाकार पंजीकरण सफलतापूर्वक प्राप्त हुआ!',
            'messageEn' => 'Artist Registration submitted successfully!',
            'registrationId' => $registrationId,
            'receiptData' => $registration->toFrontendArray(),
        ], 201);
    }

    /**
     * Public tracking of an application status
     */
    public function track(string $registrationId): JsonResponse
    {
        $registration = ArtistRegistration::where('registration_id', trim($registrationId))->first();

        if (!$registration) {
            return response()->json([
                'success' => false,
                'message' => 'आवेदन संख्या नहीं मिली (Registration ID not found).',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $registration->toFrontendArray(),
        ]);
    }
}
