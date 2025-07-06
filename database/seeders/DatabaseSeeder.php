<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        \App\Models\User::updateOrCreate(
            [
                'email' => 'test@example.com'
            ],
            [
                'name' => 'Test User',
                'password' => bcrypt('password'),
            ]
        );

        \App\Models\User::updateOrCreate(
            [
                'email' => 'nethmayasith2001@gmail.com'
            ],
            [
                'name' => 'Admin',
                'password' => bcrypt('1234'),
            ]
        );

        // Seed a test patient with a birthday
        \App\Models\Patient::updateOrCreate(
            [
                'clinicRefNo' => '123'
            ],
            [
                'firstName' => 'Nethma',
                'lastName' => 'Yasith',
                'birthday' => '2000/01/01',
                'gender' => 'male',
                'address' => 'Labugama',
                'nic' => '200105200326',
                'uhid' => 'H15',
                'chb' => '0056',
                'category' => 'Headache',
            ]
        );
    }
}
