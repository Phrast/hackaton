package com.capgemini.carbontrack.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name = "carbon_calculations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CarbonCalculation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "site_id", nullable = false)
    private Site site;

    @Column(name = "construction_co2_kg", nullable = false, precision = 18, scale = 2)
    private BigDecimal constructionCo2Kg;

    @Column(name = "exploitation_co2_kg", nullable = false, precision = 18, scale = 2)
    private BigDecimal exploitationCo2Kg;

    @Column(name = "total_co2_kg", nullable = false, precision = 18, scale = 2)
    private BigDecimal totalCo2Kg;

    @Column(name = "co2_per_m2", precision = 12, scale = 4)
    private BigDecimal co2PerM2;

    @Column(name = "co2_per_employee", precision = 12, scale = 4)
    private BigDecimal co2PerEmployee;

    @Column(name = "calculated_at", updatable = false)
    private OffsetDateTime calculatedAt;

    @PrePersist
    protected void onCreate() {
        calculatedAt = OffsetDateTime.now();
    }
}
