<?php

namespace Database\Seeders;

use App\Models\ComplaintCategory;
use App\Models\Room;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Room::create([
            'building' => 'Mtp',
            'room_number' => 'MOK-TKT-'.now()->format('Y').'-'.mt_rand(5, 99999),
            'name' => 'Acak',
            'is_active' => true,
        ]);
        ComplaintCategory::create([
            'name' => 'Mtp',
            'description' => 'ajhsdahdgjhjagsd',
            'is_active' => true,
        ]);
        User::create([
            'name' => 'admin',
            'email' => 'admin@admin.com',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
        ]);
        User::create([
            'name' => 'staff',
            'email' => 'staff@staff.com',
            'password' => Hash::make('staff123'),
            'role' => 'staff',
        ]);
        User::create([
            'name' => 'teacher',
            'email' => 'teacher@teacher.com',
            'password' => Hash::make('teacher123'),
            'role' => 'teacher',
        ]);
    }
}
