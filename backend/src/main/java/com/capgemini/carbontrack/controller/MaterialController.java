package com.capgemini.carbontrack.controller;

import com.capgemini.carbontrack.dto.response.MaterialResponse;
import com.capgemini.carbontrack.service.MaterialService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/materials")
@RequiredArgsConstructor
@Tag(name = "Materials")
public class MaterialController {

    private final MaterialService materialService;

    @GetMapping
    @Operation(summary = "Get all emission factor materials")
    public ResponseEntity<List<MaterialResponse>> findAll() {
        return ResponseEntity.ok(materialService.findAll());
    }
}
