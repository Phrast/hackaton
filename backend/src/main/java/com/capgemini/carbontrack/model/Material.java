package com.capgemini.carbontrack.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "materials")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Material {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "emission_factor", nullable = false, precision = 10, scale = 4)
    private BigDecimal emissionFactor;

    @Column(nullable = false)
    private String unit;

    private String category;

    private String description;

    private String source;
}
