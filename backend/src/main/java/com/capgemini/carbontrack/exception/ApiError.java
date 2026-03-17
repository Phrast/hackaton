package com.capgemini.carbontrack.exception;

import java.time.OffsetDateTime;
import java.util.List;

public record ApiError(
    int status,
    String message,
    List<String> errors,
    OffsetDateTime timestamp
) {
    public static ApiError of(int status, String message) {
        return new ApiError(status, message, List.of(), OffsetDateTime.now());
    }

    public static ApiError of(int status, String message, List<String> errors) {
        return new ApiError(status, message, errors, OffsetDateTime.now());
    }
}
