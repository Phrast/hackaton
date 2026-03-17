package com.capgemini.carbontrack.repository;

import com.capgemini.carbontrack.model.SiteMaterial;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SiteMaterialRepository extends JpaRepository<SiteMaterial, Long> {
    List<SiteMaterial> findBySiteId(Long siteId);
    void deleteBySiteId(Long siteId);
}
