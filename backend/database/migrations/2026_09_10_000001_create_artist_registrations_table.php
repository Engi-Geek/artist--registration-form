<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('artist_registrations', function (Blueprint $table) {
            $table->id();
            $table->string('registration_id', 60)->unique()->index();

            // Personal & Demographic Details
            $table->string('full_name', 255);
            $table->string('father_husband_name', 255);
            $table->date('dob');
            $table->unsignedSmallInteger('age');
            $table->enum('gender', ['Male', 'Female', 'Other']);
            $table->string('mobile', 15)->index();
            $table->string('email', 255)->nullable();
            $table->text('address');
            $table->string('district', 100);
            $table->string('state', 100)->index();
            $table->string('pincode', 10);

            // Art Profile
            $table->string('category', 50)->index(); // lok, janjatiya, shastriya, samkalin
            $table->string('discipline', 100);       // gayan, vadan, nritya, natak, shilp
            $table->text('art_description');
            $table->string('experience', 30);        // e.g. "16 Years" or numeric string

            // Identity & 3-Way Name Verification
            $table->string('aadhaar_number', 30);
            $table->string('aadhaar_name', 255);
            $table->string('passbook_name', 255);
            $table->boolean('name_match_verified')->default(true);

            // Document & Media Storage Relative Paths
            $table->string('photo_path', 500);
            $table->string('photo_original_name', 255)->nullable();
            $table->string('video_path', 500)->nullable();
            $table->string('video_original_name', 255)->nullable();
            $table->string('pan_path', 500)->nullable();
            $table->string('pan_original_name', 255)->nullable();
            $table->string('aadhaar_front_path', 500);
            $table->string('aadhaar_front_original_name', 255)->nullable();
            $table->string('aadhaar_back_path', 500);
            $table->string('aadhaar_back_original_name', 255)->nullable();
            $table->string('passbook_path', 500);
            $table->string('passbook_original_name', 255)->nullable();

            // Social Media Profiles
            $table->string('youtube', 500)->nullable();
            $table->string('instagram', 500)->nullable();
            $table->string('facebook', 500)->nullable();
            $table->string('portfolio', 500)->nullable();

            // Review Lifecycle & Audit
            $table->enum('status', ['UNDER_REVIEW', 'APPROVED', 'REJECTED'])->default('UNDER_REVIEW')->index();
            $table->string('status_text_hi', 255)->default('सत्यापन हेतु प्रस्तुत (Submitted for Verification)');
            $table->string('status_text_en', 255)->default('Under Review by Directorate of Culture');
            $table->text('status_remarks')->nullable();
            $table->unsignedBigInteger('reviewed_by')->nullable();
            $table->timestamp('reviewed_at')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('artist_registrations');
    }
};
