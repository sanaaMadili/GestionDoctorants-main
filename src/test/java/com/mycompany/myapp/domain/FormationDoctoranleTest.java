package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class FormationDoctoranleTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(FormationDoctoranle.class);
        FormationDoctoranle formationDoctoranle1 = new FormationDoctoranle();
        formationDoctoranle1.setId(1L);
        FormationDoctoranle formationDoctoranle2 = new FormationDoctoranle();
        formationDoctoranle2.setId(formationDoctoranle1.getId());
        assertThat(formationDoctoranle1).isEqualTo(formationDoctoranle2);
        formationDoctoranle2.setId(2L);
        assertThat(formationDoctoranle1).isNotEqualTo(formationDoctoranle2);
        formationDoctoranle1.setId(null);
        assertThat(formationDoctoranle1).isNotEqualTo(formationDoctoranle2);
    }
}
