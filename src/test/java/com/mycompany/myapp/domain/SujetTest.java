package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class SujetTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Sujet.class);
        Sujet sujet1 = new Sujet();
        sujet1.setId(1L);
        Sujet sujet2 = new Sujet();
        sujet2.setId(sujet1.getId());
        assertThat(sujet1).isEqualTo(sujet2);
        sujet2.setId(2L);
        assertThat(sujet1).isNotEqualTo(sujet2);
        sujet1.setId(null);
        assertThat(sujet1).isNotEqualTo(sujet2);
    }
}
