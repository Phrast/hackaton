package com.capgemini.carbontrack.dto.response;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

public record CalculationResponse(
    Long id,
    Long siteId,
    String siteName,
    BigDecimal constructionCo2Kg,
    BigDecimal exploitationCo2Kg,
    BigDecimal totalCo2Kg,
    BigDecimal co2PerM2,
    BigDecimal co2PerEmployee,
    OffsetDateTime calculatedAt
) {}
