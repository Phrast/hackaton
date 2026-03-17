package com.capgemini.carbontrack.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "site_materials")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SiteMaterial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "site_id", nullable = false)
    private Site site;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "material_id", nullable = false)
    private Material material;

    @Column(name = "quantity_kg", nullable = false, precision = 15, scale = 2)
    private BigDecimal quantityKg;
}
