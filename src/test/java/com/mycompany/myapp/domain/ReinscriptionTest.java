package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ReinscriptionTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Reinscription.class);
        Reinscription reinscription1 = new Reinscription();
        reinscription1.setId(1L);
        Reinscription reinscription2 = new Reinscription();
        reinscription2.setId(reinscription1.getId());
        assertThat(reinscription1).isEqualTo(reinscription2);
        reinscription2.setId(2L);
        assertThat(reinscription1).isNotEqualTo(reinscription2);
        reinscription1.setId(null);
        assertThat(reinscription1).isNotEqualTo(reinscription2);
    }
}
