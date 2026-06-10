package com.grupone.maintenance.service;

import com.grupone.maintenance.model.SparePart;
import com.grupone.maintenance.repository.SparePartRepository;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class SparePartServiceTest {

    private final SparePartRepository sparePartRepository = mock(SparePartRepository.class);
    private final SparePartService sparePartService = new SparePartService(sparePartRepository);

    @Test
    void findAllNormalizesCategoriesBeforeFiltering() {
        List<SparePart> expected = List.of(part("FILTERS"), part("BRAKES"));
        when(sparePartRepository.findByCategoryIn(List.of("FILTERS", "BRAKES"))).thenReturn(expected);

        List<SparePart> result = sparePartService.findAll(List.of(" FILTERS ", "", "BRAKES", "FILTERS"));

        assertThat(result).isEqualTo(expected);
        verify(sparePartRepository).findByCategoryIn(List.of("FILTERS", "BRAKES"));
    }

    @Test
    void findAllUsesUnfilteredQueryWhenCategoriesAreEmptyAfterNormalization() {
        List<SparePart> expected = List.of(part("ENGINE"));
        when(sparePartRepository.findAll()).thenReturn(expected);

        List<SparePart> result = sparePartService.findAll(List.of(" ", ""));

        assertThat(result).isEqualTo(expected);
        verify(sparePartRepository).findAll();
    }

    @Test
    void findCategoriesReturnsDistinctNonBlankCategoriesSortedAlphabetically() {
        when(sparePartRepository.findAll()).thenReturn(List.of(
                part(" FILTERS "),
                part("BRAKES"),
                part(""),
                part(null),
                part("FILTERS"),
                part("ENGINE")
        ));

        List<String> result = sparePartService.findCategories();

        assertThat(result).containsExactly("BRAKES", "ENGINE", "FILTERS");
    }

    private SparePart part(String category) {
        SparePart part = new SparePart();
        part.setCategory(category);
        return part;
    }
}
