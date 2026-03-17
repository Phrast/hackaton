package com.capgemini.carbontrack.service;

import com.capgemini.carbontrack.dto.request.LoginRequest;
import com.capgemini.carbontrack.dto.request.RegisterRequest;
import com.capgemini.carbontrack.dto.response.AuthResponse;
import com.capgemini.carbontrack.model.User;
import com.capgemini.carbontrack.repository.UserRepository;
import com.capgemini.carbontrack.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email already in use");
        }
        var user = User.builder()
            .email(request.email())
            .password(passwordEncoder.encode(request.password()))
            .firstName(request.firstName())
            .lastName(request.lastName())
            .role(User.Role.USER)
            .build();
        userRepository.save(user);
        return buildResponse(user);
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );
        var user = userRepository.findByEmail(request.email()).orElseThrow();
        return buildResponse(user);
    }

    private AuthResponse buildResponse(User user) {
        String token = jwtUtil.generateToken(user);
        return new AuthResponse(token, user.getEmail(), user.getFirstName(), user.getLastName(), user.getRole().name());
    }
}
