package com.fogbank.springsecurity.entities;

public enum FileStatus {
    PENDING_PAYMENT_CHOICE,   // Waiting for student to choose payment method
    PENDING_UPLOAD,           // Chose method, waiting for file upload
    UNDER_REVIEW,             // Files uploaded, admin is checking
    COMPLETED,                // Admin approved the payment
    CANCELLED
}
