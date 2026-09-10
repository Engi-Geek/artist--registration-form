<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ArtistRegistration;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AdminDashboardController extends Controller
{
    /**
     * Dashboard Metrics and Summary Counters (High performance cached queries)
     */
    public function analytics(): JsonResponse
    {
        $analytics = Cache::remember('admin_analytics_counts', 15, function () {
            $total = ArtistRegistration::count();
            $folk = ArtistRegistration::whereIn('category', ['lok', 'folk', 'FOLK'])->count();
            $tribal = ArtistRegistration::whereIn('category', ['janjatiya', 'tribal', 'TRIBAL'])->count();
            $classical = ArtistRegistration::whereIn('category', ['shastriya', 'classical', 'CLASSICAL'])->count();
            $contemporary = ArtistRegistration::whereIn('category', ['samkalin', 'contemporary', 'CONTEMPORARY'])->count();

            $approved = ArtistRegistration::where('status', 'APPROVED')->count();
            $underReview = ArtistRegistration::where('status', 'UNDER_REVIEW')->count();
            $rejected = ArtistRegistration::where('status', 'REJECTED')->count();

            $stateBreakdown = ArtistRegistration::selectRaw('state, count(*) as count')
                ->groupBy('state')
                ->orderByDesc('count')
                ->limit(10)
                ->get();

            return [
                'total' => $total,
                'folk' => $folk,
                'tribal' => $tribal,
                'classical' => $classical,
                'contemporary' => $contemporary,
                'approved' => $approved,
                'underReview' => $underReview,
                'rejected' => $rejected,
                'stateBreakdown' => $stateBreakdown,
            ];
        });

        return response()->json([
            'success' => true,
            'analytics' => $analytics,
        ]);
    }

    /**
     * Paginated & Filtered Registrations List
     */
    public function index(Request $request): JsonResponse
    {
        $query = ArtistRegistration::query();

        // Search Filter (Full Name, Mobile, Registration ID, Aadhaar)
        if ($request->filled('search')) {
            $search = trim($request->input('search'));
            $query->where(function ($q) use ($search) {
                $q->where('full_name', 'LIKE', "%{$search}%")
                    ->orWhere('registration_id', 'LIKE', "%{$search}%")
                    ->orWhere('mobile', 'LIKE', "%{$search}%")
                    ->orWhere('aadhaar_number', 'LIKE', "%{$search}%")
                    ->orWhere('district', 'LIKE', "%{$search}%");
            });
        }

        // Category Filter
        if ($request->filled('category') && $request->input('category') !== 'all') {
            $cat = $request->input('category');
            $query->where(function ($q) use ($cat) {
                $q->where('category', $cat)
                    ->orWhere('category', strtoupper($cat));
            });
        }

        // Status Filter
        if ($request->filled('status') && $request->input('status') !== 'all') {
            $query->where('status', strtoupper($request->input('status')));
        }

        // State Filter
        if ($request->filled('state') && $request->input('state') !== 'all') {
            $query->where('state', $request->input('state'));
        }

        // Discipline Filter
        if ($request->filled('discipline') && $request->input('discipline') !== 'all') {
            $query->where('discipline', $request->input('discipline'));
        }

        // Sorting
        $sortBy = $request->input('sortBy', 'created_at');
        $order = strtolower($request->input('order', 'desc')) === 'asc' ? 'asc' : 'desc';
        $query->orderBy($sortBy, $order);

        // Fetch list
        $limit = (int) $request->input('limit', 100);
        $registrations = $query->limit($limit)->get();

        $frontendList = $registrations->map(fn($item) => $item->toFrontendArray());

        return response()->json([
            'success' => true,
            'count' => $registrations->count(),
            'data' => $frontendList,
        ]);
    }

    /**
     * Get single Artist Registration details
     */
    public function show(string $id): JsonResponse
    {
        $registration = ArtistRegistration::where('registration_id', $id)
            ->orWhere('id', $id)
            ->first();

        if (!$registration) {
            return response()->json([
                'success' => false,
                'message' => 'पंजीकरण रिकॉर्ड नहीं मिला (Registration record not found).',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $registration->toFrontendArray(),
        ]);
    }

    /**
     * Update application status (APPROVED / REJECTED)
     */
    public function updateStatus(Request $request, string $id): JsonResponse
    {
        $request->validate([
            'status' => ['required', 'string', 'in:APPROVED,REJECTED,UNDER_REVIEW'],
            'remarks' => ['nullable', 'string', 'max:1000'],
        ]);

        $registration = ArtistRegistration::where('registration_id', $id)
            ->orWhere('id', $id)
            ->first();

        if (!$registration) {
            return response()->json([
                'success' => false,
                'message' => 'पंजीकरण रिकॉर्ड नहीं मिला (Registration record not found).',
            ], 404);
        }

        $newStatus = strtoupper($request->input('status'));
        $statusHi = $newStatus === 'APPROVED' ? 'स्वीकृत (Approved)' : ($newStatus === 'REJECTED' ? 'अस्वीकृत (Rejected)' : 'सत्यापन हेतु प्रस्तुत (Under Review)');
        $statusEn = $newStatus === 'APPROVED' ? 'Verified & Approved' : ($newStatus === 'REJECTED' ? 'Application Rejected' : 'Under Review by Directorate of Culture');

        $registration->update([
            'status' => $newStatus,
            'status_text_hi' => $statusHi,
            'status_text_en' => $statusEn,
            'status_remarks' => $request->input('remarks'),
            'reviewed_by' => $request->user()?->id,
            'reviewed_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'पंजीकरण स्थिति सफलतापूर्वक अपडेट की गई (Status updated successfully).',
            'data' => $registration->toFrontendArray(),
        ]);
    }

    /**
     * Export registrations as CSV
     */
    public function exportCsv(Request $request): StreamedResponse
    {
        $query = ArtistRegistration::query();

        if ($request->filled('search')) {
            $search = trim($request->input('search'));
            $query->where('full_name', 'LIKE', "%{$search}%")
                ->orWhere('registration_id', 'LIKE', "%{$search}%");
        }

        if ($request->filled('category') && $request->input('category') !== 'all') {
            $query->where('category', $request->input('category'));
        }

        if ($request->filled('status') && $request->input('status') !== 'all') {
            $query->where('status', strtoupper($request->input('status')));
        }

        if ($request->filled('state') && $request->input('state') !== 'all') {
            $query->where('state', $request->input('state'));
        }

        $records = $query->orderByDesc('created_at')->get();
        $fileName = 'Artist_Registrations_' . date('Y_m_d_His') . '.csv';

        return response()->streamDownload(function () use ($records) {
            $handle = fopen('php://output', 'w');
            // Add UTF-8 BOM for Excel Hindi support
            fputs($handle, "\xEF\xBB\xBF");

            // CSV Header
            fputcsv($handle, [
                'Registration ID',
                'Full Name',
                'Father/Husband Name',
                'DOB',
                'Age',
                'Gender',
                'Mobile',
                'Email',
                'Aadhaar Number',
                'Aadhaar Name',
                'Bank Passbook Name',
                'State',
                'District',
                'Pincode',
                'Category',
                'Discipline',
                'Experience',
                'Status',
                'Submitted At',
            ]);

            foreach ($records as $item) {
                fputcsv($handle, [
                    $item->registration_id,
                    $item->full_name,
                    $item->father_husband_name,
                    $item->dob?->format('Y-m-d') ?? '',
                    $item->age,
                    $item->gender,
                    $item->mobile,
                    $item->email ?? 'N/A',
                    $item->aadhaar_number,
                    $item->aadhaar_name,
                    $item->passbook_name,
                    $item->state,
                    $item->district,
                    $item->pincode,
                    $item->category,
                    $item->discipline,
                    $item->experience,
                    $item->status,
                    $item->created_at?->format('Y-m-d H:i:s') ?? '',
                ]);
            }

            fclose($handle);
        }, $fileName, [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$fileName}\"",
        ]);
    }
}
