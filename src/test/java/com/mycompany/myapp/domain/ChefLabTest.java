package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ChefLabTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ChefLab.class);
        ChefLab chefLab1 = new ChefLab();
        chefLab1.setId(1L);
        ChefLab chefLab2 = new ChefLab();
        chefLab2.setId(chefLab1.getId());
        assertThat(chefLab1).isEqualTo(chefLab2);
        chefLab2.setId(2L);
        assertThat(chefLab1).isNotEqualTo(chefLab2);
        chefLab1.setId(null);
        assertThat(chefLab1).isNotEqualTo(chefLab2);
    }
}
