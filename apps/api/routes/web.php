<?php

use Illuminate\Support\Facades\Route;

Route::get('/api/test-r2', function () {
    try {
        $files = Storage::disk('r2')->files();
        return response()->json(['status' => 'success', 'files' => $files]);
    } catch (\Exception $e) {
        return response()->json(['status' => 'error', 'message' => $e->getMessage()]);
    }
});
Route::post('/api/upload-pdf', function (\Illuminate\Http\Request $request) {
    $request->validate([
        'pdf' => 'required|file|mimes:pdf|min:1024|max:7168',
    ]);
    $file = $request->file('pdf');
    $filename = time() . '_' . $file->getClientOriginalName();
    Storage::disk('r2')->put($filename, file_get_contents($file));
    return response()->json(['status' => 'success', 'filename' => $filename]);
});


Route::get('/', function () {
    return null;
});
