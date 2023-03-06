package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ChefEquipeTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ChefEquipe.class);
        ChefEquipe chefEquipe1 = new ChefEquipe();
        chefEquipe1.setId(1L);
        ChefEquipe chefEquipe2 = new ChefEquipe();
        chefEquipe2.setId(chefEquipe1.getId());
        assertThat(chefEquipe1).isEqualTo(chefEquipe2);
        chefEquipe2.setId(2L);
        assertThat(chefEquipe1).isNotEqualTo(chefEquipe2);
        chefEquipe1.setId(null);
        assertThat(chefEquipe1).isNotEqualTo(chefEquipe2);
    }
}
