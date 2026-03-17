package com.capgemini.carbontrack.service;

import com.capgemini.carbontrack.dto.response.MaterialResponse;
import com.capgemini.carbontrack.model.Material;
import com.capgemini.carbontrack.repository.MaterialRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MaterialService {

    private final MaterialRepository materialRepository;

    public List<MaterialResponse> findAll() {
        return materialRepository.findAllByOrderByCategoryAscNameAsc()
            .stream()
            .map(this::toResponse)
            .toList();
    }

    public MaterialResponse toResponse(Material m) {
        return new MaterialResponse(m.getId(), m.getName(), m.getEmissionFactor(),
            m.getUnit(), m.getCategory(), m.getDescription(), m.getSource());
    }
}
