<?php

namespace App\Services;

use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserService
{
    /**
     * Create a new user.
     *
     * @param array $data
     * @return User
     */
    public function createUser(array $data): User
    {
        // Hash password
        $data['password'] = Hash::make($data['password']);

        // Create user
        $user = User::create($data);

        // Log activity
        AuditLog::log(
            action: 'create_user',
            description: "User {$user->name} ({$user->email}) dibuat dengan role {$user->role}.",
            metadata: [
                'target_user_id' => $user->id,
                'target_email' => $user->email,
                'role' => $user->role,
            ],
            modelType: User::class,
            modelId: $user->id
        );

        return $user;
    }

    /**
     * Update an existing user.
     *
     * @param User $user
     * @param array $data
     * @return User
     */
    public function updateUser(User $user, array $data): User
    {
        // Track changed fields
        $changedFields = [];
        $oldValues = [];

        // Check password change
        if (isset($data['password']) && !empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
            $changedFields[] = 'password';
        } else {
            unset($data['password']);
        }

        // Track other changes
        foreach (['name', 'email', 'role'] as $field) {
            if (isset($data[$field]) && $data[$field] !== $user->{$field}) {
                $changedFields[] = $field;
                $oldValues[$field] = $user->{$field};
            }
        }

        $oldRole = $user->role;

        // Update user
        $user->update($data);

        // Log activity
        $metadata = [
            'target_user_id' => $user->id,
            'changed_fields' => $changedFields,
        ];

        if (in_array('role', $changedFields)) {
            $metadata['old_role'] = $oldRole;
            $metadata['new_role'] = $user->role;
        }

        if (!empty($oldValues)) {
            $metadata['old_values'] = $oldValues;
        }

        $description = "User {$user->name} ({$user->email}) diupdate";
        if (!empty($changedFields)) {
            $description .= " - field yang diubah: " . implode(', ', $changedFields);
        }

        AuditLog::log(
            action: 'update_user',
            description: $description,
            metadata: $metadata,
            modelType: User::class,
            modelId: $user->id
        );

        return $user->fresh();
    }

    /**
     * Delete a user.
     *
     * @param User $user
     * @return bool
     */
    public function deleteUser(User $user): bool
    {
        $userId = $user->id;
        $userName = $user->name;
        $userEmail = $user->email;
        $userRole = $user->role;

        // Delete user
        $deleted = $user->delete();

        if ($deleted) {
            // Log activity
            AuditLog::log(
                action: 'delete_user',
                description: "User {$userName} ({$userEmail}) dengan role {$userRole} dihapus.",
                metadata: [
                    'target_user_id' => $userId,
                    'target_email' => $userEmail,
                    'role' => $userRole,
                ],
                modelType: User::class,
                modelId: $userId
            );
        }

        return $deleted;
    }
}
