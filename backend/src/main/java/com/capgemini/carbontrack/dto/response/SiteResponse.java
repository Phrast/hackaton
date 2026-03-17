package com.capgemini.carbontrack.dto.response;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

public record SiteResponse(
    Long id,
    String name,
    String address,
    String city,
    String country,
    BigDecimal surfaceM2,
    Integer parkingSpaces,
    Integer employeesCount,
    Integer workstationsCount,
    BigDecimal annualEnergyKwh,
    Integer buildingYear,
    Integer buildingLifetime,
    List<SiteMaterialResponse> materials,
    CalculationResponse latestCalculation,
    OffsetDateTime createdAt,
    OffsetDateTime updatedAt
) {}
