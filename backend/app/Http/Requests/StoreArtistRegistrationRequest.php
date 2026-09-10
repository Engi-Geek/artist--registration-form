<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class StoreArtistRegistrationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // Personal & Contact Info
            'fullName' => ['required', 'string', 'max:255'],
            'fatherHusbandName' => ['required', 'string', 'max:255'],
            'dob' => ['required', 'date', 'before:today'],
            'gender' => ['required', 'string', 'in:Male,Female,Other'],
            'mobile' => ['required', 'string', 'regex:/^[6-9]\d{9}$/'],
            'email' => ['nullable', 'email', 'max:255'],
            'address' => ['required', 'string'],
            'district' => ['required', 'string', 'max:100'],
            'state' => ['required', 'string', 'max:100'],
            'pincode' => ['required', 'string', 'regex:/^[1-9][0-9]{5}$/'],

            // Art Details
            'category' => ['required', 'string', 'max:50'],
            'discipline' => ['required', 'string', 'max:100'],
            'artDescription' => ['required', 'string'],
            'experience' => ['required'],

            // Identity & 3-Way Name Verification
            'aadhaarNumber' => ['required', 'string'],
            'aadhaarName' => ['required', 'string', 'max:255'],
            'passbookName' => ['required', 'string', 'max:255'],

            // Media Files (allows files or fallback string/demo paths)
            'photo' => ['nullable', 'max:2048'],
            'video' => ['nullable', 'max:51200'],
            'pan' => ['nullable', 'max:5120'],
            'aadhaarFront' => ['nullable', 'max:5120'],
            'aadhaarBack' => ['nullable', 'max:5120'],
            'passbook' => ['nullable', 'max:5120'],

            // Social Media
            'youtube' => ['nullable', 'url', 'max:500'],
            'instagram' => ['nullable', 'url', 'max:500'],
            'facebook' => ['nullable', 'url', 'max:500'],
            'portfolio' => ['nullable', 'url', 'max:500'],
        ];
    }

    /**
     * Custom validation rules: 3-way name match & Art description words
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function ($validator) {
            $fullName = strtolower(trim(preg_replace('/[.,\s]+/', ' ', $this->input('fullName', ''))));
            $aadhaarName = strtolower(trim(preg_replace('/[.,\s]+/', ' ', $this->input('aadhaarName', ''))));
            $passbookName = strtolower(trim(preg_replace('/[.,\s]+/', ' ', $this->input('passbookName', ''))));

            if (!empty($fullName) && !empty($aadhaarName) && $fullName !== $aadhaarName) {
                $validator->errors()->add(
                    'aadhaarName',
                    'आधार कार्ड का नाम और आवेदक का नाम समान होना चाहिए (Aadhaar Name must match Applicant Name).'
                );
            }

            if (!empty($fullName) && !empty($passbookName) && $fullName !== $passbookName) {
                $validator->errors()->add(
                    'passbookName',
                    'पासबुक का नाम और आवेदक का नाम समान होना चाहिए (Passbook Name must match Applicant Name).'
                );
            }

            // Word counter for Art Description (Max 10 words)
            $desc = trim($this->input('artDescription', ''));
            if (!empty($desc)) {
                $wordCount = count(preg_split('/\s+/', $desc, -1, PREG_SPLIT_NO_EMPTY));
                if ($wordCount > 10) {
                    $validator->errors()->add(
                        'artDescription',
                        "कला विवरण अधिकतम 10 शब्दों में होना चाहिए (वर्तमान: {$wordCount} शब्द) / Maximum 10 words allowed."
                    );
                }
            }

            // 12-digit Aadhaar verification
            $cleanAadhaar = preg_replace('/\D/', '', $this->input('aadhaarNumber', ''));
            if (strlen($cleanAadhaar) !== 12) {
                $validator->errors()->add(
                    'aadhaarNumber',
                    'आधार नंबर ठीक 12 अंकों का होना चाहिए (Aadhaar must be exactly 12 digits).'
                );
            }
        });
    }
}
