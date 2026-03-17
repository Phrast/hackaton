package com.capgemini.carbontrack.controller;

import com.capgemini.carbontrack.dto.request.SiteRequest;
import com.capgemini.carbontrack.dto.response.*;
import com.capgemini.carbontrack.model.User;
import com.capgemini.carbontrack.service.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sites")
@RequiredArgsConstructor
@Tag(name = "Sites")
public class SiteController {

    private final SiteService siteService;
    private final CarbonCalculationService calculationService;
    private final PdfExportService pdfExportService;

    @PostMapping
    @Operation(summary = "Create a new site")
    public ResponseEntity<SiteResponse> create(
        @Valid @RequestBody SiteRequest request,
        @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(siteService.create(request, user));
    }

    @GetMapping
    @Operation(summary = "List all sites for authenticated user")
    public ResponseEntity<Page<SiteResponse>> findAll(
        @AuthenticationPrincipal User user,
        @PageableDefault(size = 20, sort = "createdAt") Pageable pageable
    ) {
        return ResponseEntity.ok(siteService.findAll(user, pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a site by ID")
    public ResponseEntity<SiteResponse> findById(
        @PathVariable Long id,
        @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(siteService.findById(id, user));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a site")
    public ResponseEntity<SiteResponse> update(
        @PathVariable Long id,
        @Valid @RequestBody SiteRequest request,
        @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(siteService.update(id, request, user));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a site")
    public ResponseEntity<Void> delete(
        @PathVariable Long id,
        @AuthenticationPrincipal User user
    ) {
        siteService.delete(id, user);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/calculate")
    @Operation(summary = "Calculate carbon footprint for a site")
    public ResponseEntity<CalculationResponse> calculate(
        @PathVariable Long id,
        @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(calculationService.calculate(id));
    }

    @GetMapping("/{id}/calculations")
    @Operation(summary = "Get calculation history for a site")
    public ResponseEntity<List<CalculationResponse>> getHistory(
        @PathVariable Long id,
        @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(calculationService.getHistory(id));
    }

    @GetMapping("/{id}/export-pdf")
    @Operation(summary = "Export site report as PDF")
    public ResponseEntity<byte[]> exportPdf(
        @PathVariable Long id,
        @AuthenticationPrincipal User user
    ) {
        SiteResponse site = siteService.findById(id, user);
        byte[] pdf = pdfExportService.exportSiteReport(site);
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"rapport-" + id + ".pdf\"")
            .contentType(MediaType.APPLICATION_PDF)
            .body(pdf);
    }
}
