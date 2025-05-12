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
        Schema::create('patient_history_and_examination', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('patient_id'); // Foreign key to patients table
            $table->string('patient_clinic_ref_no')->index(); // Store the clinicRefNo for association, and for easier lookup if needed

            // History Fields
            $table->string('headacheDuration')->nullable();
            $table->string('headacheEpisode')->nullable();
            $table->string('headacheSite')->nullable();
            $table->string('headacheAura')->nullable();
            $table->string('headacheEnt')->nullable();
            $table->string('headacheEye')->nullable();
            $table->string('headacheSen')->nullable();
            $table->string('headacheFocalSymptoms')->nullable();

            $table->string('backacheDuration')->nullable();
            $table->string('backacheSite')->nullable();
            $table->string('backacheRadiation')->nullable();
            $table->string('backacheTrauma')->nullable();
            $table->string('backacheJointsInflamed')->nullable();

            $table->string('neckacheFocalSymptoms')->nullable();
            $table->string('neckacheSen')->nullable();
            $table->string('neckacheMotor')->nullable();
            $table->string('neckacheNClaud')->nullable();
            $table->string('neckacheJointsInflamed')->nullable();

            $table->string('otherTremors')->nullable();
            $table->string('otherNumbness')->nullable();
            $table->string('otherWeakness')->nullable();
            $table->string('otherGiddiness')->nullable();
            $table->text('otherOther')->nullable();

            // Examination Fields
            $table->text('neuroHigherFunctions')->nullable();
            $table->string('neuroGcs')->nullable();
            $table->string('neuroTremors')->nullable();
            $table->text('neuroCranialNerves')->nullable();
            $table->text('neuroFundi')->nullable();

            $table->string('cerebellumSigns')->nullable(); // Consolidated field

            $table->text('examMotor')->nullable();
            $table->text('examSensory')->nullable();
            $table->text('examReflex')->nullable();

            $table->string('examGait')->nullable();
            $table->string('examSpDeformity')->nullable();
            $table->string('examSlr')->nullable();
            $table->string('examLs')->nullable();

            $table->text('examHipsKnees')->nullable();

            $table->string('tenderPoints')->nullable(); // Consolidated field

            $table->string('examWasting')->nullable();
            $table->string('examEhl')->nullable();
            $table->string('examFootWeakness')->nullable();

            $table->text('examSens')->nullable(); 
            $table->text('examMotor2')->nullable(); 
            $table->text('examReflexes')->nullable();
            $table->text('examOther')->nullable();

            $table->string('pastIllness')->nullable(); // Consolidated field

            $table->string('allergies')->nullable(); // Consolidated field for Food, Drugs, Plasters
            $table->text('allergensInput')->nullable(); // Kept separate for detailed text

            $table->text('drugsInput')->nullable(); // For textual drug details
            $table->string('drugsTaken')->nullable(); // Consolidated field for specific drug checkboxes
            
            $table->timestamps();

            $table->foreign('patient_id')->references('id')->on('patients')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('patient_history_and_examination');
    }
};
