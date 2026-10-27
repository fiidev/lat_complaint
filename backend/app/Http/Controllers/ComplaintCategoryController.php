<?php

namespace App\Http\Controllers;

use App\Models\ComplaintCategory;
use Illuminate\Http\Request;

class ComplaintCategoryController extends Controller
{
    public function index(Request $request)
    {
        $category = ComplaintCategory::when($request->has('active'), fn($q) => $q->where('is_active', true))
            ->get();

        return response()->json([
            'message' => 'Complaint Category retrieved successfully.',
            'data' => $category,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'building' => 'required|string|max:255',
            'room_number' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'is_active' => 'boolean',
        ]);

        $category = ComplaintCategory::create($validated);

        return response()->json([
            'message' => 'Complaint Category created successfully.',
            'data' => $category,
        ], 201);
    }

    public function show(ComplaintCategory $category)
    {
        return response()->json([
            'message' => 'Room retrieved successfully.',
            'data' => $category,
        ]);
    }

    public function update(Request $request, ComplaintCategory $category)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'dscription' => 'sometimes|required|string|max:255',
            'is_active' => 'boolean',
        ]);

        $category->update($validated);

        return response()->json([
            'message' => 'Complaint Catgeory updated successfully.',
            'data' => $category,
        ]);
    }

    public function destroy(ComplaintCategory $category)
    {
        $category->delete();

        return response()->json([
            'message' => 'Complaint Catgeory deleted successfully.',
        ]);
    }
}
