package com.capgemini.carbontrack.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record SiteMaterialRequest(
    @NotNull Long materialId,
    @NotNull @DecimalMin("0.01") BigDecimal quantityKg
) {}
