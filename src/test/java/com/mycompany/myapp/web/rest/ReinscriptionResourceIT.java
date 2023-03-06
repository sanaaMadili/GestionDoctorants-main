package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Reinscription;
import com.mycompany.myapp.repository.ReinscriptionRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Base64Utils;

/**
 * Integration tests for the {@link ReinscriptionResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ReinscriptionResourceIT {

    private static final byte[] DEFAULT_FORMULAIRE_REINSCRIPTION = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_FORMULAIRE_REINSCRIPTION = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_FORMULAIRE_REINSCRIPTION_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_FORMULAIRE_REINSCRIPTION_CONTENT_TYPE = "image/png";

    private static final byte[] DEFAULT_DEMANDE = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_DEMANDE = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_DEMANDE_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_DEMANDE_CONTENT_TYPE = "image/png";

    private static final Double DEFAULT_ANNEE = 1D;
    private static final Double UPDATED_ANNEE = 2D;

    private static final String ENTITY_API_URL = "/api/reinscriptions";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ReinscriptionRepository reinscriptionRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restReinscriptionMockMvc;

    private Reinscription reinscription;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Reinscription createEntity(EntityManager em) {
        Reinscription reinscription = new Reinscription()
            .formulaireReinscription(DEFAULT_FORMULAIRE_REINSCRIPTION)
            .formulaireReinscriptionContentType(DEFAULT_FORMULAIRE_REINSCRIPTION_CONTENT_TYPE)
            .demande(DEFAULT_DEMANDE)
            .demandeContentType(DEFAULT_DEMANDE_CONTENT_TYPE)
            .annee(DEFAULT_ANNEE);
        return reinscription;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Reinscription createUpdatedEntity(EntityManager em) {
        Reinscription reinscription = new Reinscription()
            .formulaireReinscription(UPDATED_FORMULAIRE_REINSCRIPTION)
            .formulaireReinscriptionContentType(UPDATED_FORMULAIRE_REINSCRIPTION_CONTENT_TYPE)
            .demande(UPDATED_DEMANDE)
            .demandeContentType(UPDATED_DEMANDE_CONTENT_TYPE)
            .annee(UPDATED_ANNEE);
        return reinscription;
    }

    @BeforeEach
    public void initTest() {
        reinscription = createEntity(em);
    }

    @Test
    @Transactional
    void createReinscription() throws Exception {
        int databaseSizeBeforeCreate = reinscriptionRepository.findAll().size();
        // Create the Reinscription
        restReinscriptionMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(reinscription))
            )
            .andExpect(status().isCreated());

        // Validate the Reinscription in the database
        List<Reinscription> reinscriptionList = reinscriptionRepository.findAll();
        assertThat(reinscriptionList).hasSize(databaseSizeBeforeCreate + 1);
        Reinscription testReinscription = reinscriptionList.get(reinscriptionList.size() - 1);
        assertThat(testReinscription.getFormulaireReinscription()).isEqualTo(DEFAULT_FORMULAIRE_REINSCRIPTION);
        assertThat(testReinscription.getFormulaireReinscriptionContentType()).isEqualTo(DEFAULT_FORMULAIRE_REINSCRIPTION_CONTENT_TYPE);
        assertThat(testReinscription.getDemande()).isEqualTo(DEFAULT_DEMANDE);
        assertThat(testReinscription.getDemandeContentType()).isEqualTo(DEFAULT_DEMANDE_CONTENT_TYPE);
        assertThat(testReinscription.getAnnee()).isEqualTo(DEFAULT_ANNEE);
    }

    @Test
    @Transactional
    void createReinscriptionWithExistingId() throws Exception {
        // Create the Reinscription with an existing ID
        reinscription.setId(1L);

        int databaseSizeBeforeCreate = reinscriptionRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restReinscriptionMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(reinscription))
            )
            .andExpect(status().isBadRequest());

        // Validate the Reinscription in the database
        List<Reinscription> reinscriptionList = reinscriptionRepository.findAll();
        assertThat(reinscriptionList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllReinscriptions() throws Exception {
        // Initialize the database
        reinscriptionRepository.saveAndFlush(reinscription);

        // Get all the reinscriptionList
        restReinscriptionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(reinscription.getId().intValue())))
            .andExpect(jsonPath("$.[*].formulaireReinscriptionContentType").value(hasItem(DEFAULT_FORMULAIRE_REINSCRIPTION_CONTENT_TYPE)))
            .andExpect(
                jsonPath("$.[*].formulaireReinscription").value(hasItem(Base64Utils.encodeToString(DEFAULT_FORMULAIRE_REINSCRIPTION)))
            )
            .andExpect(jsonPath("$.[*].demandeContentType").value(hasItem(DEFAULT_DEMANDE_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].demande").value(hasItem(Base64Utils.encodeToString(DEFAULT_DEMANDE))))
            .andExpect(jsonPath("$.[*].annee").value(hasItem(DEFAULT_ANNEE.doubleValue())));
    }

    @Test
    @Transactional
    void getReinscription() throws Exception {
        // Initialize the database
        reinscriptionRepository.saveAndFlush(reinscription);

        // Get the reinscription
        restReinscriptionMockMvc
            .perform(get(ENTITY_API_URL_ID, reinscription.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(reinscription.getId().intValue()))
            .andExpect(jsonPath("$.formulaireReinscriptionContentType").value(DEFAULT_FORMULAIRE_REINSCRIPTION_CONTENT_TYPE))
            .andExpect(jsonPath("$.formulaireReinscription").value(Base64Utils.encodeToString(DEFAULT_FORMULAIRE_REINSCRIPTION)))
            .andExpect(jsonPath("$.demandeContentType").value(DEFAULT_DEMANDE_CONTENT_TYPE))
            .andExpect(jsonPath("$.demande").value(Base64Utils.encodeToString(DEFAULT_DEMANDE)))
            .andExpect(jsonPath("$.annee").value(DEFAULT_ANNEE.doubleValue()));
    }

    @Test
    @Transactional
    void getNonExistingReinscription() throws Exception {
        // Get the reinscription
        restReinscriptionMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewReinscription() throws Exception {
        // Initialize the database
        reinscriptionRepository.saveAndFlush(reinscription);

        int databaseSizeBeforeUpdate = reinscriptionRepository.findAll().size();

        // Update the reinscription
        Reinscription updatedReinscription = reinscriptionRepository.findById(reinscription.getId()).get();
        // Disconnect from session so that the updates on updatedReinscription are not directly saved in db
        em.detach(updatedReinscription);
        updatedReinscription
            .formulaireReinscription(UPDATED_FORMULAIRE_REINSCRIPTION)
            .formulaireReinscriptionContentType(UPDATED_FORMULAIRE_REINSCRIPTION_CONTENT_TYPE)
            .demande(UPDATED_DEMANDE)
            .demandeContentType(UPDATED_DEMANDE_CONTENT_TYPE)
            .annee(UPDATED_ANNEE);

        restReinscriptionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedReinscription.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedReinscription))
            )
            .andExpect(status().isOk());

        // Validate the Reinscription in the database
        List<Reinscription> reinscriptionList = reinscriptionRepository.findAll();
        assertThat(reinscriptionList).hasSize(databaseSizeBeforeUpdate);
        Reinscription testReinscription = reinscriptionList.get(reinscriptionList.size() - 1);
        assertThat(testReinscription.getFormulaireReinscription()).isEqualTo(UPDATED_FORMULAIRE_REINSCRIPTION);
        assertThat(testReinscription.getFormulaireReinscriptionContentType()).isEqualTo(UPDATED_FORMULAIRE_REINSCRIPTION_CONTENT_TYPE);
        assertThat(testReinscription.getDemande()).isEqualTo(UPDATED_DEMANDE);
        assertThat(testReinscription.getDemandeContentType()).isEqualTo(UPDATED_DEMANDE_CONTENT_TYPE);
        assertThat(testReinscription.getAnnee()).isEqualTo(UPDATED_ANNEE);
    }

    @Test
    @Transactional
    void putNonExistingReinscription() throws Exception {
        int databaseSizeBeforeUpdate = reinscriptionRepository.findAll().size();
        reinscription.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restReinscriptionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, reinscription.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(reinscription))
            )
            .andExpect(status().isBadRequest());

        // Validate the Reinscription in the database
        List<Reinscription> reinscriptionList = reinscriptionRepository.findAll();
        assertThat(reinscriptionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchReinscription() throws Exception {
        int databaseSizeBeforeUpdate = reinscriptionRepository.findAll().size();
        reinscription.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReinscriptionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(reinscription))
            )
            .andExpect(status().isBadRequest());

        // Validate the Reinscription in the database
        List<Reinscription> reinscriptionList = reinscriptionRepository.findAll();
        assertThat(reinscriptionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamReinscription() throws Exception {
        int databaseSizeBeforeUpdate = reinscriptionRepository.findAll().size();
        reinscription.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReinscriptionMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(reinscription))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Reinscription in the database
        List<Reinscription> reinscriptionList = reinscriptionRepository.findAll();
        assertThat(reinscriptionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateReinscriptionWithPatch() throws Exception {
        // Initialize the database
        reinscriptionRepository.saveAndFlush(reinscription);

        int databaseSizeBeforeUpdate = reinscriptionRepository.findAll().size();

        // Update the reinscription using partial update
        Reinscription partialUpdatedReinscription = new Reinscription();
        partialUpdatedReinscription.setId(reinscription.getId());

        partialUpdatedReinscription
            .formulaireReinscription(UPDATED_FORMULAIRE_REINSCRIPTION)
            .formulaireReinscriptionContentType(UPDATED_FORMULAIRE_REINSCRIPTION_CONTENT_TYPE)
            .demande(UPDATED_DEMANDE)
            .demandeContentType(UPDATED_DEMANDE_CONTENT_TYPE)
            .annee(UPDATED_ANNEE);

        restReinscriptionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedReinscription.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedReinscription))
            )
            .andExpect(status().isOk());

        // Validate the Reinscription in the database
        List<Reinscription> reinscriptionList = reinscriptionRepository.findAll();
        assertThat(reinscriptionList).hasSize(databaseSizeBeforeUpdate);
        Reinscription testReinscription = reinscriptionList.get(reinscriptionList.size() - 1);
        assertThat(testReinscription.getFormulaireReinscription()).isEqualTo(UPDATED_FORMULAIRE_REINSCRIPTION);
        assertThat(testReinscription.getFormulaireReinscriptionContentType()).isEqualTo(UPDATED_FORMULAIRE_REINSCRIPTION_CONTENT_TYPE);
        assertThat(testReinscription.getDemande()).isEqualTo(UPDATED_DEMANDE);
        assertThat(testReinscription.getDemandeContentType()).isEqualTo(UPDATED_DEMANDE_CONTENT_TYPE);
        assertThat(testReinscription.getAnnee()).isEqualTo(UPDATED_ANNEE);
    }

    @Test
    @Transactional
    void fullUpdateReinscriptionWithPatch() throws Exception {
        // Initialize the database
        reinscriptionRepository.saveAndFlush(reinscription);

        int databaseSizeBeforeUpdate = reinscriptionRepository.findAll().size();

        // Update the reinscription using partial update
        Reinscription partialUpdatedReinscription = new Reinscription();
        partialUpdatedReinscription.setId(reinscription.getId());

        partialUpdatedReinscription
            .formulaireReinscription(UPDATED_FORMULAIRE_REINSCRIPTION)
            .formulaireReinscriptionContentType(UPDATED_FORMULAIRE_REINSCRIPTION_CONTENT_TYPE)
            .demande(UPDATED_DEMANDE)
            .demandeContentType(UPDATED_DEMANDE_CONTENT_TYPE)
            .annee(UPDATED_ANNEE);

        restReinscriptionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedReinscription.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedReinscription))
            )
            .andExpect(status().isOk());

        // Validate the Reinscription in the database
        List<Reinscription> reinscriptionList = reinscriptionRepository.findAll();
        assertThat(reinscriptionList).hasSize(databaseSizeBeforeUpdate);
        Reinscription testReinscription = reinscriptionList.get(reinscriptionList.size() - 1);
        assertThat(testReinscription.getFormulaireReinscription()).isEqualTo(UPDATED_FORMULAIRE_REINSCRIPTION);
        assertThat(testReinscription.getFormulaireReinscriptionContentType()).isEqualTo(UPDATED_FORMULAIRE_REINSCRIPTION_CONTENT_TYPE);
        assertThat(testReinscription.getDemande()).isEqualTo(UPDATED_DEMANDE);
        assertThat(testReinscription.getDemandeContentType()).isEqualTo(UPDATED_DEMANDE_CONTENT_TYPE);
        assertThat(testReinscription.getAnnee()).isEqualTo(UPDATED_ANNEE);
    }

    @Test
    @Transactional
    void patchNonExistingReinscription() throws Exception {
        int databaseSizeBeforeUpdate = reinscriptionRepository.findAll().size();
        reinscription.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restReinscriptionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, reinscription.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(reinscription))
            )
            .andExpect(status().isBadRequest());

        // Validate the Reinscription in the database
        List<Reinscription> reinscriptionList = reinscriptionRepository.findAll();
        assertThat(reinscriptionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchReinscription() throws Exception {
        int databaseSizeBeforeUpdate = reinscriptionRepository.findAll().size();
        reinscription.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReinscriptionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(reinscription))
            )
            .andExpect(status().isBadRequest());

        // Validate the Reinscription in the database
        List<Reinscription> reinscriptionList = reinscriptionRepository.findAll();
        assertThat(reinscriptionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamReinscription() throws Exception {
        int databaseSizeBeforeUpdate = reinscriptionRepository.findAll().size();
        reinscription.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReinscriptionMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(reinscription))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Reinscription in the database
        List<Reinscription> reinscriptionList = reinscriptionRepository.findAll();
        assertThat(reinscriptionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteReinscription() throws Exception {
        // Initialize the database
        reinscriptionRepository.saveAndFlush(reinscription);

        int databaseSizeBeforeDelete = reinscriptionRepository.findAll().size();

        // Delete the reinscription
        restReinscriptionMockMvc
            .perform(delete(ENTITY_API_URL_ID, reinscription.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Reinscription> reinscriptionList = reinscriptionRepository.findAll();
        assertThat(reinscriptionList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
