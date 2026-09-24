<?php

namespace App\Http\Controllers;

use App\Models\Habit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class HabitController extends Controller
{
    /**
     * Display a listing of the authenticated user's habits.
     */
    public function index(Request $request)
{
    $date = $request->query('date', now()->toDateString());

    $query = Habit::where('user_id', auth()->id())
        ->with([
            'logs' => function ($query) use ($date) {
                $query->whereDate('date', $date);
            }
        ]);

    if ($request->has('status')) {
        if ($request->status === 'active') {
            $query->where('is_active', true);
        } elseif ($request->status === 'inactive') {
            $query->where('is_active', false);
        }
    }

    $habits = $query->latest()->get();

    $habits->each(function ($habit) {
        $habit->completed = $habit->logs->first()?->completed ?? false;
        unset($habit->logs);
    });

    return response()->json([
        'date' => $date,
        'habits' => $habits,
    ]);
}

    /**
     * Store a newly created habit for the authenticated user.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = auth('api')->user();

        $habit = $user->habits()->create([
            'title' => $request->title,
            'description' => $request->description,
            'is_active' => $request->has('is_active') ? $request->boolean('is_active') : true,
        ]);

        return response()->json([
            'message' => 'Habit created successfully',
            'habit' => $habit,
        ], 201);
    }

    /**
     * Display the specified habit of the authenticated user.
     */
    public function show($id)
    {
        $user = auth('api')->user();
        $habit = $user->habits()->find($id);

        if (!$habit) {
            return response()->json([
                'message' => 'Habit not found',
            ], 404);
        }

        return response()->json([
            'habit' => $habit,
        ]);
    }

    /**
     * Update the specified habit of the authenticated user.
     */
    public function update(Request $request, $id)
    {
        $user = auth('api')->user();
        $habit = $user->habits()->find($id);

        if (!$habit) {
            return response()->json([
                'message' => 'Habit not found',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = [];
        if ($request->has('title')) {
            $data['title'] = $request->input('title');
        }
        if ($request->has('description')) {
            $data['description'] = $request->input('description');
        }
        if ($request->has('is_active')) {
            $data['is_active'] = $request->boolean('is_active');
        }

        $habit->update($data);

        return response()->json([
            'message' => 'Habit updated successfully',
            'habit' => $habit->fresh(),
        ]);
    }

    /**
     * Remove the specified habit of the authenticated user.
     */
    public function destroy($id)
    {
        $user = auth('api')->user();
        $habit = $user->habits()->find($id);

        if (!$habit) {
            return response()->json([
                'message' => 'Habit not found',
            ], 404);
        }

        $habit->delete();

        return response()->json([
            'message' => 'Habit deleted successfully',
        ]);
    }
}
