package com.capgemini.carbontrack.repository;

import com.capgemini.carbontrack.model.Material;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MaterialRepository extends JpaRepository<Material, Long> {
    List<Material> findByCategory(String category);
    List<Material> findAllByOrderByCategoryAscNameAsc();
}
