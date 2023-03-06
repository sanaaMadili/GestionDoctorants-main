package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class DiplomesTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Diplomes.class);
        Diplomes diplomes1 = new Diplomes();
        diplomes1.setId(1L);
        Diplomes diplomes2 = new Diplomes();
        diplomes2.setId(diplomes1.getId());
        assertThat(diplomes1).isEqualTo(diplomes2);
        diplomes2.setId(2L);
        assertThat(diplomes1).isNotEqualTo(diplomes2);
        diplomes1.setId(null);
        assertThat(diplomes1).isNotEqualTo(diplomes2);
    }
}
