<?php

namespace App\Http\Controllers;

use App\Models\Habit;
use App\Models\HabitLog;
use Illuminate\Http\Request;

class HabitLogController extends Controller
{
    public function complete(Request $request, string $id)
    {
        return $this->setCompletionStatus($request, $id, true);
    }

    public function incomplete(Request $request, string $id)
    {
        return $this->setCompletionStatus($request, $id, false);
    }

    private function setCompletionStatus(
        Request $request,
        string $id,
        bool $completed
    ) {
        $validated = $request->validate([
            'date' => 'nullable|date_format:Y-m-d',
        ]);

        $habit = Habit::where('user_id', auth()->id())
            ->findOrFail($id);

        $date = $validated['date'] ?? now()->toDateString();

        $log = HabitLog::updateOrCreate(
            [
                'habit_id' => $habit->id,
                'date' => $date,
            ],
            [
                'completed' => $completed,
            ]
        );

        return response()->json([
            'message' => $completed
                ? 'Habit marked as completed'
                : 'Habit marked as incomplete',
            'log' => $log,
        ]);
    }
}