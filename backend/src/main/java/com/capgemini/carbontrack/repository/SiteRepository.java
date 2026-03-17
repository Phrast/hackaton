package com.capgemini.carbontrack.repository;

import com.capgemini.carbontrack.model.Site;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface SiteRepository extends JpaRepository<Site, Long> {

    Page<Site> findByUserId(Long userId, Pageable pageable);

    List<Site> findByUserId(Long userId);

    @Query("SELECT s FROM Site s LEFT JOIN FETCH s.siteMaterials sm LEFT JOIN FETCH sm.material WHERE s.id = :id")
    Optional<Site> findByIdWithMaterials(@Param("id") Long id);

    @Query("SELECT s FROM Site s WHERE s.id IN :ids")
    List<Site> findAllByIdIn(@Param("ids") List<Long> ids);

    long countByUserId(Long userId);
}
