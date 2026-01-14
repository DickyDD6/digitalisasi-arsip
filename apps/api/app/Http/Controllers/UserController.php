<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    protected UserService $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    /**
     * Display a listing of the users.
     */
    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', User::class);

        $query = User::query();

        // Search by name or email
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Filter by role
        if ($request->has('role')) {
            $query->where('role', $request->input('role'));
        }

        // Pagination
        $perPage = $request->input('per_page', 15);
        $users = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json([
            'message' => 'Daftar user berhasil diambil.',
            'data' => UserResource::collection($users),
            'meta' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
            ],
        ], 200);
    }

    /**
     * Store a newly created user in storage.
     */
    public function store(CreateUserRequest $request): JsonResponse
    {
        $this->authorize('create', User::class);

        $user = $this->userService->createUser($request->validated());

        return response()->json([
            'message' => 'User berhasil dibuat.',
            'data' => new UserResource($user),
        ], 201);
    }

    /**
     * Display the specified user.
     */
    public function show(User $user): JsonResponse
    {
        $this->authorize('view', $user);

        return response()->json([
            'message' => 'Detail user berhasil diambil.',
            'data' => new UserResource($user),
        ], 200);
    }

    /**
     * Update the specified user in storage.
     */
    public function update(UpdateUserRequest $request, User $user): JsonResponse
    {
        $this->authorize('update', $user);

        $updatedUser = $this->userService->updateUser($user, $request->validated());

        return response()->json([
            'message' => 'User berhasil diupdate.',
            'data' => new UserResource($updatedUser),
        ], 200);
    }

    /**
     * Remove the specified user from storage.
     */
    public function destroy(User $user): JsonResponse
    {
        // Check if trying to delete self
        if (auth()->id() === $user->id) {
            return response()->json([
                'message' => 'Tidak dapat menghapus akun sendiri.',
                'errors' => [
                    'user_id' => ['Anda tidak dapat menghapus akun Anda sendiri.'],
                ],
            ], 422);
        }

        $this->authorize('delete', $user);

        $this->userService->deleteUser($user);

        return response()->json([
            'message' => 'User berhasil dihapus.',
        ], 200);
    }
}
