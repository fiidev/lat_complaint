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

    public function run(): void
    {
        $rooms = [
            ['building' => 'Gedung A', 'room_number' => 'A-101', 'name' => 'Lab Komputer 1', 'is_active' => true],
            ['building' => 'Gedung A', 'room_number' => 'A-102', 'name' => 'Lab Komputer 2', 'is_active' => true],
            ['building' => 'Gedung B', 'room_number' => 'B-201', 'name' => 'Ruang Teori XII RPL 1', 'is_active' => true],
            ['building' => 'Gedung B', 'room_number' => 'B-202', 'name' => 'Ruang Teori XII TKJ 1', 'is_active' => true],
            ['building' => 'Gedung C', 'room_number' => 'C-301', 'name' => 'Perpustakaan', 'is_active' => true],
        ];

        foreach ($rooms as $room) {
            Room::firstOrCreate(['building' => $room['building'], 'room_number' => $room['room_number']], $room);
        }

        $categories = [
            ['name' => 'Kelistrikan', 'description' => 'Masalah stop kontak, lampu mati, MCB turun, dsb.', 'is_active' => true],
            ['name' => 'Jaringan & Internet', 'description' => 'Masalah kabel LAN, access point / WiFi, router.', 'is_active' => true],
            ['name' => 'Fasilitas Kelas', 'description' => 'Masalah AC tidak dingin, proyektor mati, kursi/meja rusak.', 'is_active' => true],
            ['name' => 'Kebersihan & Sanitasi', 'description' => 'Masalah kran air bocor, toilet tersumbat, dsb.', 'is_active' => true],
        ];

        foreach ($categories as $category) {
            ComplaintCategory::firstOrCreate(['name' => $category['name']], $category);
        }

        $users = [
            [
                'name' => 'Administrator',
                'email' => 'admin@admin.com',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
            ],
            [
                'name' => 'Staff Teknisi',
                'email' => 'staff@staff.com',
                'password' => Hash::make('staff123'),
                'role' => 'staff',
            ],
            [
                'name' => 'Staff Teknisi 2',
                'email' => 'staff2@staff.com',
                'password' => Hash::make('staff123'),
                'role' => 'staff',
            ],
            [
                'name' => 'Guru Pengajar',
                'email' => 'teacher@teacher.com',
                'password' => Hash::make('teacher123'),
                'role' => 'teacher',
            ],
            [
                'name' => 'Siswa Pelapor',
                'email' => 'student@student.com',
                'password' => Hash::make('student123'),
                'role' => 'student',
            ],
        ];

        foreach ($users as $user) {
            User::firstOrCreate(['email' => $user['email']], $user);
        }
    }
}
