package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CursusTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Cursus.class);
        Cursus cursus1 = new Cursus();
        cursus1.setId(1L);
        Cursus cursus2 = new Cursus();
        cursus2.setId(cursus1.getId());
        assertThat(cursus1).isEqualTo(cursus2);
        cursus2.setId(2L);
        assertThat(cursus1).isNotEqualTo(cursus2);
        cursus1.setId(null);
        assertThat(cursus1).isNotEqualTo(cursus2);
    }
}
