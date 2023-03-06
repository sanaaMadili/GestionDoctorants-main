package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ChercheurExterneTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ChercheurExterne.class);
        ChercheurExterne chercheurExterne1 = new ChercheurExterne();
        chercheurExterne1.setId(1L);
        ChercheurExterne chercheurExterne2 = new ChercheurExterne();
        chercheurExterne2.setId(chercheurExterne1.getId());
        assertThat(chercheurExterne1).isEqualTo(chercheurExterne2);
        chercheurExterne2.setId(2L);
        assertThat(chercheurExterne1).isNotEqualTo(chercheurExterne2);
        chercheurExterne1.setId(null);
        assertThat(chercheurExterne1).isNotEqualTo(chercheurExterne2);
    }
}
