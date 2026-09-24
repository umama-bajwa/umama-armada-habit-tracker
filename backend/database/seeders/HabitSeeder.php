<?php

namespace Database\Seeders;

use App\Models\Habit;
use App\Models\User;
use Illuminate\Database\Seeder;

class HabitSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::firstOrCreate(
            ['email' => 'demo@example.com'],
            [
                'name' => 'Demo User',
                'password' => 'password',
            ]
        );

        Habit::create([
            'user_id' => $user->id,
            'title' => 'Drink Water',
            'description' => 'Drink 8 glasses of water.',
            'is_active' => true,
        ]);

        Habit::create([
            'user_id' => $user->id,
            'title' => 'Exercise',
            'description' => 'Exercise for 30 minutes.',
            'is_active' => true,
        ]);

        Habit::create([
            'user_id' => $user->id,
            'title' => 'Read',
            'description' => 'Read for 20 minutes.',
            'is_active' => false,
        ]);
    }
}