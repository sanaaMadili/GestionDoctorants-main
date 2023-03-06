package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class FormationSuivieTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(FormationSuivie.class);
        FormationSuivie formationSuivie1 = new FormationSuivie();
        formationSuivie1.setId(1L);
        FormationSuivie formationSuivie2 = new FormationSuivie();
        formationSuivie2.setId(formationSuivie1.getId());
        assertThat(formationSuivie1).isEqualTo(formationSuivie2);
        formationSuivie2.setId(2L);
        assertThat(formationSuivie1).isNotEqualTo(formationSuivie2);
        formationSuivie1.setId(null);
        assertThat(formationSuivie1).isNotEqualTo(formationSuivie2);
    }
}
