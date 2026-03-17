package com.capgemini.carbontrack.service;

import com.capgemini.carbontrack.dto.request.SiteRequest;
import com.capgemini.carbontrack.dto.response.*;
import com.capgemini.carbontrack.exception.ResourceNotFoundException;
import com.capgemini.carbontrack.model.*;
import com.capgemini.carbontrack.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SiteService {

    private final SiteRepository siteRepository;
    private final MaterialRepository materialRepository;
    private final CarbonCalculationRepository calculationRepository;
    private final CarbonCalculationService calculationService;

    @Transactional
    public SiteResponse create(SiteRequest request, User user) {
        var site = buildSite(request, user);
        siteRepository.save(site);
        attachMaterials(site, request);
        return toResponse(site);
    }

    @Transactional
    public SiteResponse update(Long id, SiteRequest request, User user) {
        Site site = getOwnedSite(id, user);
        updateSiteFields(site, request);
        site.getSiteMaterials().clear();
        attachMaterials(site, request);
        siteRepository.save(site);
        return toResponse(site);
    }

    public Page<SiteResponse> findAll(User user, Pageable pageable) {
        return siteRepository.findByUserId(user.getId(), pageable)
            .map(this::toResponse);
    }

    public SiteResponse findById(Long id, User user) {
        Site site = getOwnedSite(id, user);
        return toResponse(site);
    }

    @Transactional
    public void delete(Long id, User user) {
        Site site = getOwnedSite(id, user);
        siteRepository.delete(site);
    }

    public ComparisonResponse compare(List<Long> siteIds, User user) {
        List<Site> sites = siteRepository.findAllByIdIn(siteIds);
        List<CarbonCalculation> latestCalcs = calculationRepository.findLatestForSites(siteIds);

        List<ComparisonResponse.SiteComparisonItem> items = sites.stream().map(site -> {
            CalculationResponse calc = latestCalcs.stream()
                .filter(c -> c.getSite().getId().equals(site.getId()))
                .findFirst()
                .map(calculationService::toResponse)
                .orElse(null);
            return new ComparisonResponse.SiteComparisonItem(site.getId(), site.getName(), site.getCity(), calc);
        }).toList();

        return new ComparisonResponse(items);
    }

    private Site buildSite(SiteRequest req, User user) {
        return Site.builder()
            .user(user)
            .name(req.name())
            .address(req.address())
            .city(req.city())
            .country(req.country() != null ? req.country() : "France")
            .surfaceM2(req.surfaceM2())
            .parkingSpaces(req.parkingSpaces())
            .employeesCount(req.employeesCount())
            .workstationsCount(req.workstationsCount())
            .annualEnergyKwh(req.annualEnergyKwh())
            .buildingYear(req.buildingYear())
            .buildingLifetime(req.buildingLifetime() != null ? req.buildingLifetime() : 50)
            .build();
    }

    private void updateSiteFields(Site site, SiteRequest req) {
        site.setName(req.name());
        site.setAddress(req.address());
        site.setCity(req.city());
        site.setCountry(req.country() != null ? req.country() : "France");
        site.setSurfaceM2(req.surfaceM2());
        site.setParkingSpaces(req.parkingSpaces());
        site.setEmployeesCount(req.employeesCount());
        site.setWorkstationsCount(req.workstationsCount());
        site.setAnnualEnergyKwh(req.annualEnergyKwh());
        site.setBuildingYear(req.buildingYear());
        site.setBuildingLifetime(req.buildingLifetime() != null ? req.buildingLifetime() : 50);
    }

    private void attachMaterials(Site site, SiteRequest req) {
        if (req.materials() == null) return;
        req.materials().forEach(materialReq -> {
            Material material = materialRepository.findById(materialReq.materialId())
                .orElseThrow(() -> new ResourceNotFoundException("Material", materialReq.materialId()));
            var siteMaterial = SiteMaterial.builder()
                .site(site)
                .material(material)
                .quantityKg(materialReq.quantityKg())
                .build();
            site.getSiteMaterials().add(siteMaterial);
        });
    }

    private Site getOwnedSite(Long id, User user) {
        return siteRepository.findByIdWithMaterials(id)
            .filter(s -> s.getUser() == null || s.getUser().getId().equals(user.getId()))
            .orElseThrow(() -> new ResourceNotFoundException("Site", id));
    }

    private SiteResponse toResponse(Site site) {
        List<SiteMaterialResponse> materials = site.getSiteMaterials().stream()
            .map(sm -> new SiteMaterialResponse(
                sm.getId(),
                sm.getMaterial().getId(),
                sm.getMaterial().getName(),
                sm.getMaterial().getCategory(),
                sm.getMaterial().getEmissionFactor(),
                sm.getMaterial().getUnit(),
                sm.getQuantityKg(),
                sm.getQuantityKg().multiply(sm.getMaterial().getEmissionFactor())
            )).toList();

        CalculationResponse latestCalc = calculationRepository
            .findFirstBySiteIdOrderByCalculatedAtDesc(site.getId())
            .map(calculationService::toResponse)
            .orElse(null);

        return new SiteResponse(
            site.getId(), site.getName(), site.getAddress(), site.getCity(), site.getCountry(),
            site.getSurfaceM2(), site.getParkingSpaces(), site.getEmployeesCount(),
            site.getWorkstationsCount(), site.getAnnualEnergyKwh(),
            site.getBuildingYear(), site.getBuildingLifetime(),
            materials, latestCalc, site.getCreatedAt(), site.getUpdatedAt()
        );
    }
}
