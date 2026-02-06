<?php

namespace App\Policies;

use App\Enums\DocumentStatus;
use App\Models\Document;
use App\Models\User;

class DocumentPolicy
{
    /**
     * Determine whether the user can view any documents.
     */
    public function viewAny(User $user): bool
    {
        // All authenticated users can view documents
        return true;
    }

    /**
     * Determine whether the user can view the document.
     */
    public function view(User $user, Document $document): bool
    {
        // All authenticated users can view documents
        return true;
    }

    /**
     * Determine whether the user can create documents (upload).
     */
    public function create(User $user): bool
    {
        // Only manager and uploader can upload documents
        return $user->hasAnyRole(['manager', 'uploader']);
    }

    /**
     * Determine whether the user can update the document.
     * 
     * Note: This only checks ROLE and OWNERSHIP.
     * Business logic (document status) is checked in DocumentService
     * to return proper 422 error instead of 403.
     */
    public function update(User $user, Document $document): bool
    {
        // Manager can always update
        if ($user->hasRole('manager')) {
            return true;
        }

        // Uploader can only update documents they own
        // Status check is done in DocumentService for proper 422 response
        if ($user->hasRole('uploader')) {
            return $document->uploaded_by === $user->id;
        }

        return false;
    }

    /**
     * Determine whether the user can delete the document.
     */
    public function delete(User $user, Document $document): bool
    {
        // Only manager and uploader can delete
        // And only if status is tidak_terverifikasi
        if (!$user->hasAnyRole(['manager', 'uploader'])) {
            return false;
        }

        // Can only delete rejected documents
        return $document->status === DocumentStatus::REJECTED;
    }

    /**
     * Determine whether the user can view pending documents.
     */
    public function viewPending(User $user): bool
    {
        // Only manager and qc can view pending verification queue
        return $user->hasAnyRole(['manager', 'qc']);
    }

    /**
     * Determine whether the user can verify a specific document.
     * 
     * Note: This only checks if user has the ROLE to verify.
     * Business logic (document status) is checked in DocumentService
     * to return proper 422 error instead of 403.
     */
    public function verify(User $user, Document $document): bool
    {
        // Only manager and qc can verify documents
        return $user->hasAnyRole(['manager', 'qc']);
    }

    /**
     * Determine whether the user can download documents.
     */
    public function download(User $user, Document $document): bool
    {
        // Only manager and sbap can download
        if (!$user->hasAnyRole(['manager', 'sbap'])) {
            return false;
        }

        // SBAP can only download if document is verified
        if ($user->hasRole('sbap')) {
            return $document->status === DocumentStatus::VERIFIED;
        }

        // Manager can download any document
        return true;
    }
}
