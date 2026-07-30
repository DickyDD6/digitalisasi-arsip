<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /**
     * Display a listing of notifications for the authenticated user.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $query = Notification::where('user_id', $user->id)
            ->orderBy('created_at', 'desc');

        if ($request->boolean('unread_only')) {
            $query->whereNull('read_at');
        }

        $perPage = (int) $request->input('per_page', 15);
        $notifications = $query->paginate($perPage);

        return response()->json([
            'status' => 'success',
            'data' => $notifications->items(),
            'meta' => [
                'current_page' => $notifications->currentPage(),
                'last_page' => $notifications->lastPage(),
                'per_page' => $notifications->perPage(),
                'total' => $notifications->total(),
                'unread_count' => Notification::where('user_id', $user->id)->whereNull('read_at')->count(),
            ],
        ]);
    }

    /**
     * Get unread notifications count for the navbar badge.
     */
    public function unreadCount(Request $request): JsonResponse
    {
        $count = Notification::where('user_id', $request->user()->id)
            ->whereNull('read_at')
            ->count();

        return response()->json([
            'status' => 'success',
            'unread_count' => $count,
        ]);
    }

    /**
     * Mark a single notification as read.
     */
    public function markAsRead(Request $request, string $id): JsonResponse
    {
        $notification = Notification::where('user_id', $request->user()->id)
            ->where('id', $id)
            ->firstOrFail();

        if (!$notification->read_at) {
            $notification->update(['read_at' => now()]);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Notifikasi berhasil ditandai sebagai sudah dibaca.',
            'data' => $notification,
        ]);
    }

    /**
     * Mark all notifications of the user as read.
     */
    public function markAllAsRead(Request $request): JsonResponse
    {
        Notification::where('user_id', $request->user()->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return response()->json([
            'status' => 'success',
            'message' => 'Semua notifikasi berhasil ditandai sebagai sudah dibaca.',
        ]);
    }

    /**
     * Remove the specified notification.
     */
    public function destroy(Request $request, string $id): JsonResponse
    {
        $notification = Notification::where('user_id', $request->user()->id)
            ->where('id', $id)
            ->firstOrFail();

        $notification->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Notifikasi berhasil dihapus.',
        ]);
    }
}
