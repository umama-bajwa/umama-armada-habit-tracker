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
        $user = auth('api')->user();

        $query = $user->habits()->latest();

        $status = strtolower(trim((string) $request->query('status')));

        if ($status === 'active') {
            $query->where('is_active', true);
        } elseif ($status === 'inactive') {
            $query->where('is_active', false);
        }
        // status 'all' or unspecified defaults to returning all habits

        $habits = $query->get();

        return response()->json([
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
