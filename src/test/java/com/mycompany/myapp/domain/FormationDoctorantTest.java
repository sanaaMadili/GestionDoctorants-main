package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class FormationDoctorantTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(FormationDoctorant.class);
        FormationDoctorant formationDoctorant1 = new FormationDoctorant();
        formationDoctorant1.setId(1L);
        FormationDoctorant formationDoctorant2 = new FormationDoctorant();
        formationDoctorant2.setId(formationDoctorant1.getId());
        assertThat(formationDoctorant1).isEqualTo(formationDoctorant2);
        formationDoctorant2.setId(2L);
        assertThat(formationDoctorant1).isNotEqualTo(formationDoctorant2);
        formationDoctorant1.setId(null);
        assertThat(formationDoctorant1).isNotEqualTo(formationDoctorant2);
    }
}
