<?php

namespace App\Services;

class RegIdGeneratorService
{
    /**
     * Category mapping table
     */
    protected static array $categoryMap = [
        'lok' => 'FOLK',
        'janjatiya' => 'TRIBAL',
        'shastriya' => 'CLASSICAL',
        'samkalin' => 'CONTEMP',
    ];

    /**
     * Discipline mapping table
     */
    protected static array $disciplineMap = [
        'gayan' => 'VOCAL',
        'vadan' => 'INST',
        'nritya' => 'DANCE',
        'natak' => 'THEATRE',
        'shilp' => 'CRAFT',
    ];

    /**
     * Generate Combo Registration ID: [CATEGORY]-[DISCIPLINE]-[STATE]-[LAST4]
     */
    public static function generate(
        string $category,
        string $discipline,
        string $state,
        ?string $aadhaarNumber = null,
        ?string $mobile = null
    ): string {
        // 1. Category Code
        $catLower = strtolower(trim($category));
        $catCode = self::$categoryMap[$catLower] ?? strtoupper(substr(preg_replace('/[^a-zA-Z]/', '', $category), 0, 6));
        if (empty($catCode)) {
            $catCode = 'ART';
        }

        // 2. Discipline Code
        $discLower = strtolower(trim($discipline));
        $discCode = self::$disciplineMap[$discLower] ?? strtoupper(substr(preg_replace('/[^a-zA-Z]/', '', $discipline), 0, 5));
        if (empty($discCode)) {
            $discCode = 'GEN';
        }

        // 3. State Code
        $cleanState = strtoupper(preg_replace('/[^a-zA-Z]/', '', $state));
        $stateCode = strlen($cleanState) >= 3 ? substr($cleanState, 0, 3) : ($cleanState ?: 'IND');

        // 4. Last 4 Digits from Aadhaar or Mobile
        $cleanAadhaar = preg_replace('/\D/', '', $aadhaarNumber ?? '');
        $cleanMobile = preg_replace('/\D/', '', $mobile ?? '');

        if (strlen($cleanAadhaar) >= 4) {
            $lastDigits = substr($cleanAadhaar, -4);
        } elseif (strlen($cleanMobile) >= 4) {
            $lastDigits = substr($cleanMobile, -4);
        } else {
            $lastDigits = (string) rand(1000, 9999);
        }

        return "{$catCode}-{$discCode}-{$stateCode}-{$lastDigits}";
    }
}
