package com.capgemini.carbontrack.service;

import com.capgemini.carbontrack.dto.response.CalculationResponse;
import com.capgemini.carbontrack.exception.ResourceNotFoundException;
import com.capgemini.carbontrack.model.CarbonCalculation;
import com.capgemini.carbontrack.model.Site;
import com.capgemini.carbontrack.repository.CarbonCalculationRepository;
import com.capgemini.carbontrack.repository.SiteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CarbonCalculationService {

    // ADEME 2023: electricity emission factor for France (kgCO2e/kWh)
    private static final BigDecimal ELECTRICITY_FACTOR = new BigDecimal("0.0567");
    private static final int SCALE = 2;

    private final SiteRepository siteRepository;
    private final CarbonCalculationRepository calculationRepository;

    @Transactional
    public CalculationResponse calculate(Long siteId) {
        Site site = siteRepository.findByIdWithMaterials(siteId)
            .orElseThrow(() -> new ResourceNotFoundException("Site", siteId));

        BigDecimal constructionCo2 = calculateConstructionCo2(site);
        BigDecimal exploitationCo2Annual = calculateExploitationCo2(site);
        int lifetime = site.getBuildingLifetime() != null ? site.getBuildingLifetime() : 50;
        BigDecimal exploitationCo2Total = exploitationCo2Annual.multiply(BigDecimal.valueOf(lifetime));
        BigDecimal totalCo2 = constructionCo2.add(exploitationCo2Total);

        BigDecimal co2PerM2 = site.getSurfaceM2() != null && site.getSurfaceM2().compareTo(BigDecimal.ZERO) > 0
            ? totalCo2.divide(site.getSurfaceM2(), 4, RoundingMode.HALF_UP)
            : null;

        BigDecimal co2PerEmployee = site.getEmployeesCount() != null && site.getEmployeesCount() > 0
            ? totalCo2.divide(BigDecimal.valueOf(site.getEmployeesCount()), 4, RoundingMode.HALF_UP)
            : null;

        var calculation = CarbonCalculation.builder()
            .site(site)
            .constructionCo2Kg(constructionCo2.setScale(SCALE, RoundingMode.HALF_UP))
            .exploitationCo2Kg(exploitationCo2Annual.setScale(SCALE, RoundingMode.HALF_UP))
            .totalCo2Kg(totalCo2.setScale(SCALE, RoundingMode.HALF_UP))
            .co2PerM2(co2PerM2)
            .co2PerEmployee(co2PerEmployee)
            .build();

        calculationRepository.save(calculation);
        return toResponse(calculation);
    }

    public List<CalculationResponse> getHistory(Long siteId) {
        return calculationRepository.findBySiteIdOrderByCalculatedAtDesc(siteId)
            .stream()
            .map(this::toResponse)
            .toList();
    }

    // Construction CO₂ = Σ(quantity_kg × emission_factor)
    private BigDecimal calculateConstructionCo2(Site site) {
        return site.getSiteMaterials().stream()
            .map(sm -> sm.getQuantityKg().multiply(sm.getMaterial().getEmissionFactor()))
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    // Exploitation CO₂ (annual) = annual_energy_kWh × 0.0567
    private BigDecimal calculateExploitationCo2(Site site) {
        if (site.getAnnualEnergyKwh() == null) return BigDecimal.ZERO;
        return site.getAnnualEnergyKwh().multiply(ELECTRICITY_FACTOR);
    }

    public CalculationResponse toResponse(CarbonCalculation c) {
        return new CalculationResponse(
            c.getId(), c.getSite().getId(), c.getSite().getName(),
            c.getConstructionCo2Kg(), c.getExploitationCo2Kg(), c.getTotalCo2Kg(),
            c.getCo2PerM2(), c.getCo2PerEmployee(), c.getCalculatedAt()
        );
    }
}
