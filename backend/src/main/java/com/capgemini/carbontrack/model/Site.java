package com.capgemini.carbontrack.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "sites")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Site {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false)
    private String name;

    private String address;

    private String city;

    @Column(nullable = false)
    private String country;

    @Column(name = "surface_m2", precision = 12, scale = 2)
    private BigDecimal surfaceM2;

    @Column(name = "parking_spaces")
    private Integer parkingSpaces;

    @Column(name = "employees_count")
    private Integer employeesCount;

    @Column(name = "workstations_count")
    private Integer workstationsCount;

    @Column(name = "annual_energy_kwh", precision = 15, scale = 2)
    private BigDecimal annualEnergyKwh;

    @Column(name = "building_year")
    private Integer buildingYear;

    @Column(name = "building_lifetime")
    private Integer buildingLifetime;

    @OneToMany(mappedBy = "site", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<SiteMaterial> siteMaterials = new ArrayList<>();

    @OneToMany(mappedBy = "site", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<CarbonCalculation> calculations = new ArrayList<>();

    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = OffsetDateTime.now();
        updatedAt = OffsetDateTime.now();
        if (country == null) country = "France";
        if (buildingLifetime == null) buildingLifetime = 50;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = OffsetDateTime.now();
    }
}
