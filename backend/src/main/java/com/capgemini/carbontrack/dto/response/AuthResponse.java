package com.capgemini.carbontrack.dto.response;

public record AuthResponse(
    String token,
    String email,
    String firstName,
    String lastName,
    String role
) {}
