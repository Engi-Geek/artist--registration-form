<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class ArtistRegistration extends Model
{
    use HasFactory;

    protected $table = 'artist_registrations';

    protected $fillable = [
        'registration_id',
        'full_name',
        'father_husband_name',
        'dob',
        'age',
        'gender',
        'mobile',
        'email',
        'address',
        'district',
        'state',
        'pincode',
        'category',
        'discipline',
        'art_description',
        'experience',
        'aadhaar_number',
        'aadhaar_name',
        'passbook_name',
        'name_match_verified',
        'photo_path',
        'photo_original_name',
        'video_path',
        'video_original_name',
        'pan_path',
        'pan_original_name',
        'aadhaar_front_path',
        'aadhaar_front_original_name',
        'aadhaar_back_path',
        'aadhaar_back_original_name',
        'passbook_path',
        'passbook_original_name',
        'youtube',
        'instagram',
        'facebook',
        'portfolio',
        'status',
        'status_text_hi',
        'status_text_en',
        'status_remarks',
        'reviewed_by',
        'reviewed_at',
    ];

    protected $casts = [
        'dob' => 'date:Y-m-d',
        'age' => 'integer',
        'name_match_verified' => 'boolean',
        'reviewed_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected $appends = [
        'photo_url',
        'video_url',
        'pan_url',
        'aadhaar_front_url',
        'aadhaar_back_url',
        'passbook_url',
    ];

    /**
     * Helpers to convert stored path to full public accessible URL
     */
    protected function resolveFileUrl(?string $path, ?string $fallback = null): ?string
    {
        if (empty($path)) {
            return $fallback;
        }

        // If path is already an external URL
        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return $path;
        }

        return asset('storage/' . ltrim($path, '/'));
    }

    public function getPhotoUrlAttribute(): ?string
    {
        return $this->resolveFileUrl(
            $this->photo_path,
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80'
        );
    }

    public function getVideoUrlAttribute(): ?string
    {
        return $this->resolveFileUrl(
            $this->video_path,
            'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
        );
    }

    public function getPanUrlAttribute(): ?string
    {
        return $this->resolveFileUrl(
            $this->pan_path,
            'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80'
        );
    }

    public function getAadhaarFrontUrlAttribute(): ?string
    {
        return $this->resolveFileUrl(
            $this->aadhaar_front_path,
            'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80'
        );
    }

    public function getAadhaarBackUrlAttribute(): ?string
    {
        return $this->resolveFileUrl(
            $this->aadhaar_back_path,
            'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80'
        );
    }

    public function getPassbookUrlAttribute(): ?string
    {
        return $this->resolveFileUrl(
            $this->passbook_path,
            'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&auto=format&fit=crop&q=80'
        );
    }

    /**
     * Serialized representation matching existing React front-end components
     */
    public function toFrontendArray(): array
    {
        return [
            'registrationId' => $this->registration_id,
            'submissionTime' => $this->created_at?->toISOString() ?? now()->toISOString(),
            'status' => $this->status,
            'statusTextHi' => $this->status_text_hi,
            'statusTextEn' => $this->status_text_en,
            'statusRemarks' => $this->status_remarks,
            'applicant' => [
                'fullName' => $this->full_name,
                'fatherHusbandName' => $this->father_husband_name,
                'dob' => $this->dob?->format('Y-m-d') ?? '',
                'age' => $this->age,
                'gender' => $this->gender,
                'mobile' => $this->mobile,
                'email' => $this->email ?? 'N/A',
                'address' => $this->address,
                'district' => $this->district,
                'state' => $this->state,
                'pincode' => $this->pincode,
                'aadhaarNumber' => $this->aadhaar_number,
                'aadhaarName' => $this->aadhaar_name,
                'passbookName' => $this->passbook_name,
            ],
            'artDetails' => [
                'category' => $this->category,
                'discipline' => $this->discipline,
                'artDescription' => $this->art_description,
                'experience' => str_contains($this->experience, 'Year') ? $this->experience : "{$this->experience} Years",
            ],
            'documents' => [
                'photoName' => $this->photo_original_name ?? 'photo.jpg',
                'photoUrl' => $this->photo_url,
                'videoName' => $this->video_original_name ?? 'video.mp4',
                'videoUrl' => $this->video_url,
                'panName' => $this->pan_original_name ?? 'pan_card.jpg',
                'panUrl' => $this->pan_url,
                'aadhaarFrontName' => $this->aadhaar_front_original_name ?? 'aadhaar_front.jpg',
                'aadhaarFrontUrl' => $this->aadhaar_front_url,
                'aadhaarBackName' => $this->aadhaar_back_original_name ?? 'aadhaar_back.jpg',
                'aadhaarBackUrl' => $this->aadhaar_back_url,
                'passbookName' => $this->passbook_original_name ?? 'passbook.jpg',
                'passbookUrl' => $this->passbook_url,
            ],
            'socialLinks' => [
                'youtube' => $this->youtube ?? '',
                'instagram' => $this->instagram ?? '',
                'facebook' => $this->facebook ?? '',
                'portfolio' => $this->portfolio ?? '',
            ],
        ];
    }
}
