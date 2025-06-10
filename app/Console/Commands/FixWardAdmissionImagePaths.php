<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\WardAdmission;
use Illuminate\Support\Facades\Storage;

class FixWardAdmissionImagePaths extends Command
{
    /**
    * The name and signature of the console command.
    *
    * @var string
    */
    protected $signature = 'fix:ward-admission-image-paths';
    
    /**
    * The console command description.
    *
    * @var string
    */
    protected $description = 'Fixes incorrect image paths for ward admissions in the database.';
    
    /**
    * Execute the console command.
    */
    public function handle()
    {
        $this->info('Starting to fix ward admission image paths...');
        
        $admissions = WardAdmission::all();
        $fixedCount = 0;
        
        foreach ($admissions as $admission) {
            $originalPaths = $admission->image_paths;
            $updatedPaths = [];
            $needsUpdate = false;
            
            if (is_array($originalPaths)) {
                foreach ($originalPaths as $path) {
                    // Check if the path contains the incorrect segment
                    if (str_contains($path, '/private/public/ward_admissions/')) {
                        // Replace the incorrect segment with the correct one
                        $newPath = str_replace('/private/public/ward_admissions/', '/public/ward_admissions/', $path);
                        $updatedPaths[] = $newPath;
                        $needsUpdate = true;
                    } else {
                        $updatedPaths[] = $path;
                    }
                }
            }
            
            if ($needsUpdate) {
                $admission->image_paths = $updatedPaths;
                $admission->save();
                $fixedCount++;
                $this->info("Updated paths for Ward Admission ID: {$admission->id}");
            }
        }
        
        if ($fixedCount > 0) {
            $this->info("Successfully fixed {$fixedCount} ward admission records.");
        } else {
            $this->info('No ward admission records needed path updates.');
        }
        
        $this->info('Image path fixing process completed.');
    }
}
