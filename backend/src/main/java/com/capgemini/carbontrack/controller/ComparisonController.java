package com.capgemini.carbontrack.controller;

import com.capgemini.carbontrack.dto.response.ComparisonResponse;
import com.capgemini.carbontrack.model.User;
import com.capgemini.carbontrack.service.SiteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/compare")
@RequiredArgsConstructor
@Tag(name = "Comparison")
public class ComparisonController {

    private final SiteService siteService;

    @GetMapping
    @Operation(summary = "Compare multiple sites by their IDs")
    public ResponseEntity<ComparisonResponse> compare(
        @RequestParam List<Long> siteIds,
        @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(siteService.compare(siteIds, user));
    }
}
