package com.capgemini.carbontrack.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.util.List;

public record SiteRequest(
    @NotBlank String name,
    String address,
    String city,
    String country,
    @Positive BigDecimal surfaceM2,
    Integer parkingSpaces,
    Integer employeesCount,
    Integer workstationsCount,
    @Positive BigDecimal annualEnergyKwh,
    Integer buildingYear,
    Integer buildingLifetime,
    @Valid List<SiteMaterialRequest> materials
) {}
