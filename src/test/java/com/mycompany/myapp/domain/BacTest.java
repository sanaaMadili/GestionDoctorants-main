package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class BacTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Bac.class);
        Bac bac1 = new Bac();
        bac1.setId(1L);
        Bac bac2 = new Bac();
        bac2.setId(bac1.getId());
        assertThat(bac1).isEqualTo(bac2);
        bac2.setId(2L);
        assertThat(bac1).isNotEqualTo(bac2);
        bac1.setId(null);
        assertThat(bac1).isNotEqualTo(bac2);
    }
}
