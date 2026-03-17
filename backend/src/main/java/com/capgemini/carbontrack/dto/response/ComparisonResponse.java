package com.capgemini.carbontrack.dto.response;

import java.util.List;

public record ComparisonResponse(
    List<SiteComparisonItem> sites
) {
    public record SiteComparisonItem(
        Long siteId,
        String siteName,
        String city,
        CalculationResponse latestCalculation
    ) {}
}
