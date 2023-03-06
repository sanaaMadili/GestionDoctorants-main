package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class DoctorantTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Doctorant.class);
        Doctorant doctorant1 = new Doctorant();
        doctorant1.setId(1L);
        Doctorant doctorant2 = new Doctorant();
        doctorant2.setId(doctorant1.getId());
        assertThat(doctorant1).isEqualTo(doctorant2);
        doctorant2.setId(2L);
        assertThat(doctorant1).isNotEqualTo(doctorant2);
        doctorant1.setId(null);
        assertThat(doctorant1).isNotEqualTo(doctorant2);
    }
}
