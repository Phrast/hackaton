package com.capgemini.carbontrack.repository;

import com.capgemini.carbontrack.model.CarbonCalculation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CarbonCalculationRepository extends JpaRepository<CarbonCalculation, Long> {

    List<CarbonCalculation> findBySiteIdOrderByCalculatedAtDesc(Long siteId);

    Optional<CarbonCalculation> findFirstBySiteIdOrderByCalculatedAtDesc(Long siteId);

    @Query("SELECT c FROM CarbonCalculation c WHERE c.site.id IN :siteIds " +
           "AND c.calculatedAt = (SELECT MAX(c2.calculatedAt) FROM CarbonCalculation c2 WHERE c2.site.id = c.site.id)")
    List<CarbonCalculation> findLatestForSites(@Param("siteIds") List<Long> siteIds);
}
