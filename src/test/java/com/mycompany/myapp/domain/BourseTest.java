package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class BourseTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Bourse.class);
        Bourse bourse1 = new Bourse();
        bourse1.setId(1L);
        Bourse bourse2 = new Bourse();
        bourse2.setId(bourse1.getId());
        assertThat(bourse1).isEqualTo(bourse2);
        bourse2.setId(2L);
        assertThat(bourse1).isNotEqualTo(bourse2);
        bourse1.setId(null);
        assertThat(bourse1).isNotEqualTo(bourse2);
    }
}
