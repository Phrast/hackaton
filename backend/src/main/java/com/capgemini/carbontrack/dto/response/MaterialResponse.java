package com.capgemini.carbontrack.dto.response;

import java.math.BigDecimal;

public record MaterialResponse(
    Long id,
    String name,
    BigDecimal emissionFactor,
    String unit,
    String category,
    String description,
    String source
) {}
