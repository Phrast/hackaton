package com.capgemini.carbontrack.dto.response;

import java.math.BigDecimal;

public record SiteMaterialResponse(
    Long id,
    Long materialId,
    String materialName,
    String category,
    BigDecimal emissionFactor,
    String unit,
    BigDecimal quantityKg,
    BigDecimal co2Kg
) {}
