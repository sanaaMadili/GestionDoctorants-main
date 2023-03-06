package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.FormationSuivie;
import com.mycompany.myapp.repository.FormationSuivieRepository;
import java.time.LocalDate;
import java.time.ZoneId;
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
 * Integration tests for the {@link FormationSuivieResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class FormationSuivieResourceIT {

    private static final Integer DEFAULT_DUREE = 1;
    private static final Integer UPDATED_DUREE = 2;

    private static final byte[] DEFAULT_ATTESTATION = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_ATTESTATION = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_ATTESTATION_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_ATTESTATION_CONTENT_TYPE = "image/png";

    private static final LocalDate DEFAULT_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_TITRE = "AAAAAAAAAA";
    private static final String UPDATED_TITRE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/formation-suivies";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private FormationSuivieRepository formationSuivieRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restFormationSuivieMockMvc;

    private FormationSuivie formationSuivie;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static FormationSuivie createEntity(EntityManager em) {
        FormationSuivie formationSuivie = new FormationSuivie()
            .duree(DEFAULT_DUREE)
            .attestation(DEFAULT_ATTESTATION)
            .attestationContentType(DEFAULT_ATTESTATION_CONTENT_TYPE)
            .date(DEFAULT_DATE)
            .titre(DEFAULT_TITRE);
        return formationSuivie;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static FormationSuivie createUpdatedEntity(EntityManager em) {
        FormationSuivie formationSuivie = new FormationSuivie()
            .duree(UPDATED_DUREE)
            .attestation(UPDATED_ATTESTATION)
            .attestationContentType(UPDATED_ATTESTATION_CONTENT_TYPE)
            .date(UPDATED_DATE)
            .titre(UPDATED_TITRE);
        return formationSuivie;
    }

    @BeforeEach
    public void initTest() {
        formationSuivie = createEntity(em);
    }

    @Test
    @Transactional
    void createFormationSuivie() throws Exception {
        int databaseSizeBeforeCreate = formationSuivieRepository.findAll().size();
        // Create the FormationSuivie
        restFormationSuivieMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(formationSuivie))
            )
            .andExpect(status().isCreated());

        // Validate the FormationSuivie in the database
        List<FormationSuivie> formationSuivieList = formationSuivieRepository.findAll();
        assertThat(formationSuivieList).hasSize(databaseSizeBeforeCreate + 1);
        FormationSuivie testFormationSuivie = formationSuivieList.get(formationSuivieList.size() - 1);
        assertThat(testFormationSuivie.getDuree()).isEqualTo(DEFAULT_DUREE);
        assertThat(testFormationSuivie.getAttestation()).isEqualTo(DEFAULT_ATTESTATION);
        assertThat(testFormationSuivie.getAttestationContentType()).isEqualTo(DEFAULT_ATTESTATION_CONTENT_TYPE);
        assertThat(testFormationSuivie.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testFormationSuivie.getTitre()).isEqualTo(DEFAULT_TITRE);
    }

    @Test
    @Transactional
    void createFormationSuivieWithExistingId() throws Exception {
        // Create the FormationSuivie with an existing ID
        formationSuivie.setId(1L);

        int databaseSizeBeforeCreate = formationSuivieRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restFormationSuivieMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(formationSuivie))
            )
            .andExpect(status().isBadRequest());

        // Validate the FormationSuivie in the database
        List<FormationSuivie> formationSuivieList = formationSuivieRepository.findAll();
        assertThat(formationSuivieList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkDureeIsRequired() throws Exception {
        int databaseSizeBeforeTest = formationSuivieRepository.findAll().size();
        // set the field null
        formationSuivie.setDuree(null);

        // Create the FormationSuivie, which fails.

        restFormationSuivieMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(formationSuivie))
            )
            .andExpect(status().isBadRequest());

        List<FormationSuivie> formationSuivieList = formationSuivieRepository.findAll();
        assertThat(formationSuivieList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllFormationSuivies() throws Exception {
        // Initialize the database
        formationSuivieRepository.saveAndFlush(formationSuivie);

        // Get all the formationSuivieList
        restFormationSuivieMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(formationSuivie.getId().intValue())))
            .andExpect(jsonPath("$.[*].duree").value(hasItem(DEFAULT_DUREE)))
            .andExpect(jsonPath("$.[*].attestationContentType").value(hasItem(DEFAULT_ATTESTATION_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].attestation").value(hasItem(Base64Utils.encodeToString(DEFAULT_ATTESTATION))))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())))
            .andExpect(jsonPath("$.[*].titre").value(hasItem(DEFAULT_TITRE)));
    }

    @Test
    @Transactional
    void getFormationSuivie() throws Exception {
        // Initialize the database
        formationSuivieRepository.saveAndFlush(formationSuivie);

        // Get the formationSuivie
        restFormationSuivieMockMvc
            .perform(get(ENTITY_API_URL_ID, formationSuivie.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(formationSuivie.getId().intValue()))
            .andExpect(jsonPath("$.duree").value(DEFAULT_DUREE))
            .andExpect(jsonPath("$.attestationContentType").value(DEFAULT_ATTESTATION_CONTENT_TYPE))
            .andExpect(jsonPath("$.attestation").value(Base64Utils.encodeToString(DEFAULT_ATTESTATION)))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()))
            .andExpect(jsonPath("$.titre").value(DEFAULT_TITRE));
    }

    @Test
    @Transactional
    void getNonExistingFormationSuivie() throws Exception {
        // Get the formationSuivie
        restFormationSuivieMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewFormationSuivie() throws Exception {
        // Initialize the database
        formationSuivieRepository.saveAndFlush(formationSuivie);

        int databaseSizeBeforeUpdate = formationSuivieRepository.findAll().size();

        // Update the formationSuivie
        FormationSuivie updatedFormationSuivie = formationSuivieRepository.findById(formationSuivie.getId()).get();
        // Disconnect from session so that the updates on updatedFormationSuivie are not directly saved in db
        em.detach(updatedFormationSuivie);
        updatedFormationSuivie
            .duree(UPDATED_DUREE)
            .attestation(UPDATED_ATTESTATION)
            .attestationContentType(UPDATED_ATTESTATION_CONTENT_TYPE)
            .date(UPDATED_DATE)
            .titre(UPDATED_TITRE);

        restFormationSuivieMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedFormationSuivie.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedFormationSuivie))
            )
            .andExpect(status().isOk());

        // Validate the FormationSuivie in the database
        List<FormationSuivie> formationSuivieList = formationSuivieRepository.findAll();
        assertThat(formationSuivieList).hasSize(databaseSizeBeforeUpdate);
        FormationSuivie testFormationSuivie = formationSuivieList.get(formationSuivieList.size() - 1);
        assertThat(testFormationSuivie.getDuree()).isEqualTo(UPDATED_DUREE);
        assertThat(testFormationSuivie.getAttestation()).isEqualTo(UPDATED_ATTESTATION);
        assertThat(testFormationSuivie.getAttestationContentType()).isEqualTo(UPDATED_ATTESTATION_CONTENT_TYPE);
        assertThat(testFormationSuivie.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testFormationSuivie.getTitre()).isEqualTo(UPDATED_TITRE);
    }

    @Test
    @Transactional
    void putNonExistingFormationSuivie() throws Exception {
        int databaseSizeBeforeUpdate = formationSuivieRepository.findAll().size();
        formationSuivie.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFormationSuivieMockMvc
            .perform(
                put(ENTITY_API_URL_ID, formationSuivie.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(formationSuivie))
            )
            .andExpect(status().isBadRequest());

        // Validate the FormationSuivie in the database
        List<FormationSuivie> formationSuivieList = formationSuivieRepository.findAll();
        assertThat(formationSuivieList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchFormationSuivie() throws Exception {
        int databaseSizeBeforeUpdate = formationSuivieRepository.findAll().size();
        formationSuivie.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFormationSuivieMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(formationSuivie))
            )
            .andExpect(status().isBadRequest());

        // Validate the FormationSuivie in the database
        List<FormationSuivie> formationSuivieList = formationSuivieRepository.findAll();
        assertThat(formationSuivieList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamFormationSuivie() throws Exception {
        int databaseSizeBeforeUpdate = formationSuivieRepository.findAll().size();
        formationSuivie.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFormationSuivieMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(formationSuivie))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the FormationSuivie in the database
        List<FormationSuivie> formationSuivieList = formationSuivieRepository.findAll();
        assertThat(formationSuivieList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateFormationSuivieWithPatch() throws Exception {
        // Initialize the database
        formationSuivieRepository.saveAndFlush(formationSuivie);

        int databaseSizeBeforeUpdate = formationSuivieRepository.findAll().size();

        // Update the formationSuivie using partial update
        FormationSuivie partialUpdatedFormationSuivie = new FormationSuivie();
        partialUpdatedFormationSuivie.setId(formationSuivie.getId());

        partialUpdatedFormationSuivie.duree(UPDATED_DUREE);

        restFormationSuivieMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFormationSuivie.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFormationSuivie))
            )
            .andExpect(status().isOk());

        // Validate the FormationSuivie in the database
        List<FormationSuivie> formationSuivieList = formationSuivieRepository.findAll();
        assertThat(formationSuivieList).hasSize(databaseSizeBeforeUpdate);
        FormationSuivie testFormationSuivie = formationSuivieList.get(formationSuivieList.size() - 1);
        assertThat(testFormationSuivie.getDuree()).isEqualTo(UPDATED_DUREE);
        assertThat(testFormationSuivie.getAttestation()).isEqualTo(DEFAULT_ATTESTATION);
        assertThat(testFormationSuivie.getAttestationContentType()).isEqualTo(DEFAULT_ATTESTATION_CONTENT_TYPE);
        assertThat(testFormationSuivie.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testFormationSuivie.getTitre()).isEqualTo(DEFAULT_TITRE);
    }

    @Test
    @Transactional
    void fullUpdateFormationSuivieWithPatch() throws Exception {
        // Initialize the database
        formationSuivieRepository.saveAndFlush(formationSuivie);

        int databaseSizeBeforeUpdate = formationSuivieRepository.findAll().size();

        // Update the formationSuivie using partial update
        FormationSuivie partialUpdatedFormationSuivie = new FormationSuivie();
        partialUpdatedFormationSuivie.setId(formationSuivie.getId());

        partialUpdatedFormationSuivie
            .duree(UPDATED_DUREE)
            .attestation(UPDATED_ATTESTATION)
            .attestationContentType(UPDATED_ATTESTATION_CONTENT_TYPE)
            .date(UPDATED_DATE)
            .titre(UPDATED_TITRE);

        restFormationSuivieMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFormationSuivie.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFormationSuivie))
            )
            .andExpect(status().isOk());

        // Validate the FormationSuivie in the database
        List<FormationSuivie> formationSuivieList = formationSuivieRepository.findAll();
        assertThat(formationSuivieList).hasSize(databaseSizeBeforeUpdate);
        FormationSuivie testFormationSuivie = formationSuivieList.get(formationSuivieList.size() - 1);
        assertThat(testFormationSuivie.getDuree()).isEqualTo(UPDATED_DUREE);
        assertThat(testFormationSuivie.getAttestation()).isEqualTo(UPDATED_ATTESTATION);
        assertThat(testFormationSuivie.getAttestationContentType()).isEqualTo(UPDATED_ATTESTATION_CONTENT_TYPE);
        assertThat(testFormationSuivie.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testFormationSuivie.getTitre()).isEqualTo(UPDATED_TITRE);
    }

    @Test
    @Transactional
    void patchNonExistingFormationSuivie() throws Exception {
        int databaseSizeBeforeUpdate = formationSuivieRepository.findAll().size();
        formationSuivie.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFormationSuivieMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, formationSuivie.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(formationSuivie))
            )
            .andExpect(status().isBadRequest());

        // Validate the FormationSuivie in the database
        List<FormationSuivie> formationSuivieList = formationSuivieRepository.findAll();
        assertThat(formationSuivieList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchFormationSuivie() throws Exception {
        int databaseSizeBeforeUpdate = formationSuivieRepository.findAll().size();
        formationSuivie.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFormationSuivieMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(formationSuivie))
            )
            .andExpect(status().isBadRequest());

        // Validate the FormationSuivie in the database
        List<FormationSuivie> formationSuivieList = formationSuivieRepository.findAll();
        assertThat(formationSuivieList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamFormationSuivie() throws Exception {
        int databaseSizeBeforeUpdate = formationSuivieRepository.findAll().size();
        formationSuivie.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFormationSuivieMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(formationSuivie))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the FormationSuivie in the database
        List<FormationSuivie> formationSuivieList = formationSuivieRepository.findAll();
        assertThat(formationSuivieList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteFormationSuivie() throws Exception {
        // Initialize the database
        formationSuivieRepository.saveAndFlush(formationSuivie);

        int databaseSizeBeforeDelete = formationSuivieRepository.findAll().size();

        // Delete the formationSuivie
        restFormationSuivieMockMvc
            .perform(delete(ENTITY_API_URL_ID, formationSuivie.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<FormationSuivie> formationSuivieList = formationSuivieRepository.findAll();
        assertThat(formationSuivieList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
