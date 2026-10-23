<?php

namespace App\Http\Controllers;

use App\Models\ComplaintCategory;

class ComplaintCategoryController extends Controller
{
    public function __invoke()
    {
        $categories = ComplaintCategory::where('is_active', true)->get();

        return response()->json([
            'message' => 'Categories retrieved successfully.',
            'data' => $categories,
        ]);
    }
}
