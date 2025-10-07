package com.fogbank.springsecurity.entities;

public enum ProofStatus {
    PENDING_UPLOAD,      // Waiting for student to upload document
    UNDER_REVIEW,        // Document uploaded, admin is checking
    APPROVED,           // Admin approved the proof
    REJECTED,           // Admin rejected the proof (needs re-upload)
    CANCELLED
}
