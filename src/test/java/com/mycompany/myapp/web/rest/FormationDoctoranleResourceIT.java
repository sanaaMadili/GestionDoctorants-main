package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.FormationDoctoranle;
import com.mycompany.myapp.repository.FormationDoctoranleRepository;
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

/**
 * Integration tests for the {@link FormationDoctoranleResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class FormationDoctoranleResourceIT {

    private static final String DEFAULT_THEMATIQUE = "AAAAAAAAAA";
    private static final String UPDATED_THEMATIQUE = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/formation-doctoranles";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private FormationDoctoranleRepository formationDoctoranleRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restFormationDoctoranleMockMvc;

    private FormationDoctoranle formationDoctoranle;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static FormationDoctoranle createEntity(EntityManager em) {
        FormationDoctoranle formationDoctoranle = new FormationDoctoranle().thematique(DEFAULT_THEMATIQUE).description(DEFAULT_DESCRIPTION);
        return formationDoctoranle;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static FormationDoctoranle createUpdatedEntity(EntityManager em) {
        FormationDoctoranle formationDoctoranle = new FormationDoctoranle().thematique(UPDATED_THEMATIQUE).description(UPDATED_DESCRIPTION);
        return formationDoctoranle;
    }

    @BeforeEach
    public void initTest() {
        formationDoctoranle = createEntity(em);
    }

    @Test
    @Transactional
    void createFormationDoctoranle() throws Exception {
        int databaseSizeBeforeCreate = formationDoctoranleRepository.findAll().size();
        // Create the FormationDoctoranle
        restFormationDoctoranleMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(formationDoctoranle))
            )
            .andExpect(status().isCreated());

        // Validate the FormationDoctoranle in the database
        List<FormationDoctoranle> formationDoctoranleList = formationDoctoranleRepository.findAll();
        assertThat(formationDoctoranleList).hasSize(databaseSizeBeforeCreate + 1);
        FormationDoctoranle testFormationDoctoranle = formationDoctoranleList.get(formationDoctoranleList.size() - 1);
        assertThat(testFormationDoctoranle.getThematique()).isEqualTo(DEFAULT_THEMATIQUE);
        assertThat(testFormationDoctoranle.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    void createFormationDoctoranleWithExistingId() throws Exception {
        // Create the FormationDoctoranle with an existing ID
        formationDoctoranle.setId(1L);

        int databaseSizeBeforeCreate = formationDoctoranleRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restFormationDoctoranleMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(formationDoctoranle))
            )
            .andExpect(status().isBadRequest());

        // Validate the FormationDoctoranle in the database
        List<FormationDoctoranle> formationDoctoranleList = formationDoctoranleRepository.findAll();
        assertThat(formationDoctoranleList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkThematiqueIsRequired() throws Exception {
        int databaseSizeBeforeTest = formationDoctoranleRepository.findAll().size();
        // set the field null
        formationDoctoranle.setThematique(null);

        // Create the FormationDoctoranle, which fails.

        restFormationDoctoranleMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(formationDoctoranle))
            )
            .andExpect(status().isBadRequest());

        List<FormationDoctoranle> formationDoctoranleList = formationDoctoranleRepository.findAll();
        assertThat(formationDoctoranleList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllFormationDoctoranles() throws Exception {
        // Initialize the database
        formationDoctoranleRepository.saveAndFlush(formationDoctoranle);

        // Get all the formationDoctoranleList
        restFormationDoctoranleMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(formationDoctoranle.getId().intValue())))
            .andExpect(jsonPath("$.[*].thematique").value(hasItem(DEFAULT_THEMATIQUE)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)));
    }

    @Test
    @Transactional
    void getFormationDoctoranle() throws Exception {
        // Initialize the database
        formationDoctoranleRepository.saveAndFlush(formationDoctoranle);

        // Get the formationDoctoranle
        restFormationDoctoranleMockMvc
            .perform(get(ENTITY_API_URL_ID, formationDoctoranle.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(formationDoctoranle.getId().intValue()))
            .andExpect(jsonPath("$.thematique").value(DEFAULT_THEMATIQUE))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION));
    }

    @Test
    @Transactional
    void getNonExistingFormationDoctoranle() throws Exception {
        // Get the formationDoctoranle
        restFormationDoctoranleMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewFormationDoctoranle() throws Exception {
        // Initialize the database
        formationDoctoranleRepository.saveAndFlush(formationDoctoranle);

        int databaseSizeBeforeUpdate = formationDoctoranleRepository.findAll().size();

        // Update the formationDoctoranle
        FormationDoctoranle updatedFormationDoctoranle = formationDoctoranleRepository.findById(formationDoctoranle.getId()).get();
        // Disconnect from session so that the updates on updatedFormationDoctoranle are not directly saved in db
        em.detach(updatedFormationDoctoranle);
        updatedFormationDoctoranle.thematique(UPDATED_THEMATIQUE).description(UPDATED_DESCRIPTION);

        restFormationDoctoranleMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedFormationDoctoranle.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedFormationDoctoranle))
            )
            .andExpect(status().isOk());

        // Validate the FormationDoctoranle in the database
        List<FormationDoctoranle> formationDoctoranleList = formationDoctoranleRepository.findAll();
        assertThat(formationDoctoranleList).hasSize(databaseSizeBeforeUpdate);
        FormationDoctoranle testFormationDoctoranle = formationDoctoranleList.get(formationDoctoranleList.size() - 1);
        assertThat(testFormationDoctoranle.getThematique()).isEqualTo(UPDATED_THEMATIQUE);
        assertThat(testFormationDoctoranle.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void putNonExistingFormationDoctoranle() throws Exception {
        int databaseSizeBeforeUpdate = formationDoctoranleRepository.findAll().size();
        formationDoctoranle.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFormationDoctoranleMockMvc
            .perform(
                put(ENTITY_API_URL_ID, formationDoctoranle.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(formationDoctoranle))
            )
            .andExpect(status().isBadRequest());

        // Validate the FormationDoctoranle in the database
        List<FormationDoctoranle> formationDoctoranleList = formationDoctoranleRepository.findAll();
        assertThat(formationDoctoranleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchFormationDoctoranle() throws Exception {
        int databaseSizeBeforeUpdate = formationDoctoranleRepository.findAll().size();
        formationDoctoranle.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFormationDoctoranleMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(formationDoctoranle))
            )
            .andExpect(status().isBadRequest());

        // Validate the FormationDoctoranle in the database
        List<FormationDoctoranle> formationDoctoranleList = formationDoctoranleRepository.findAll();
        assertThat(formationDoctoranleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamFormationDoctoranle() throws Exception {
        int databaseSizeBeforeUpdate = formationDoctoranleRepository.findAll().size();
        formationDoctoranle.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFormationDoctoranleMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(formationDoctoranle))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the FormationDoctoranle in the database
        List<FormationDoctoranle> formationDoctoranleList = formationDoctoranleRepository.findAll();
        assertThat(formationDoctoranleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateFormationDoctoranleWithPatch() throws Exception {
        // Initialize the database
        formationDoctoranleRepository.saveAndFlush(formationDoctoranle);

        int databaseSizeBeforeUpdate = formationDoctoranleRepository.findAll().size();

        // Update the formationDoctoranle using partial update
        FormationDoctoranle partialUpdatedFormationDoctoranle = new FormationDoctoranle();
        partialUpdatedFormationDoctoranle.setId(formationDoctoranle.getId());

        partialUpdatedFormationDoctoranle.thematique(UPDATED_THEMATIQUE);

        restFormationDoctoranleMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFormationDoctoranle.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFormationDoctoranle))
            )
            .andExpect(status().isOk());

        // Validate the FormationDoctoranle in the database
        List<FormationDoctoranle> formationDoctoranleList = formationDoctoranleRepository.findAll();
        assertThat(formationDoctoranleList).hasSize(databaseSizeBeforeUpdate);
        FormationDoctoranle testFormationDoctoranle = formationDoctoranleList.get(formationDoctoranleList.size() - 1);
        assertThat(testFormationDoctoranle.getThematique()).isEqualTo(UPDATED_THEMATIQUE);
        assertThat(testFormationDoctoranle.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    void fullUpdateFormationDoctoranleWithPatch() throws Exception {
        // Initialize the database
        formationDoctoranleRepository.saveAndFlush(formationDoctoranle);

        int databaseSizeBeforeUpdate = formationDoctoranleRepository.findAll().size();

        // Update the formationDoctoranle using partial update
        FormationDoctoranle partialUpdatedFormationDoctoranle = new FormationDoctoranle();
        partialUpdatedFormationDoctoranle.setId(formationDoctoranle.getId());

        partialUpdatedFormationDoctoranle.thematique(UPDATED_THEMATIQUE).description(UPDATED_DESCRIPTION);

        restFormationDoctoranleMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFormationDoctoranle.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFormationDoctoranle))
            )
            .andExpect(status().isOk());

        // Validate the FormationDoctoranle in the database
        List<FormationDoctoranle> formationDoctoranleList = formationDoctoranleRepository.findAll();
        assertThat(formationDoctoranleList).hasSize(databaseSizeBeforeUpdate);
        FormationDoctoranle testFormationDoctoranle = formationDoctoranleList.get(formationDoctoranleList.size() - 1);
        assertThat(testFormationDoctoranle.getThematique()).isEqualTo(UPDATED_THEMATIQUE);
        assertThat(testFormationDoctoranle.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void patchNonExistingFormationDoctoranle() throws Exception {
        int databaseSizeBeforeUpdate = formationDoctoranleRepository.findAll().size();
        formationDoctoranle.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFormationDoctoranleMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, formationDoctoranle.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(formationDoctoranle))
            )
            .andExpect(status().isBadRequest());

        // Validate the FormationDoctoranle in the database
        List<FormationDoctoranle> formationDoctoranleList = formationDoctoranleRepository.findAll();
        assertThat(formationDoctoranleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchFormationDoctoranle() throws Exception {
        int databaseSizeBeforeUpdate = formationDoctoranleRepository.findAll().size();
        formationDoctoranle.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFormationDoctoranleMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(formationDoctoranle))
            )
            .andExpect(status().isBadRequest());

        // Validate the FormationDoctoranle in the database
        List<FormationDoctoranle> formationDoctoranleList = formationDoctoranleRepository.findAll();
        assertThat(formationDoctoranleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamFormationDoctoranle() throws Exception {
        int databaseSizeBeforeUpdate = formationDoctoranleRepository.findAll().size();
        formationDoctoranle.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFormationDoctoranleMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(formationDoctoranle))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the FormationDoctoranle in the database
        List<FormationDoctoranle> formationDoctoranleList = formationDoctoranleRepository.findAll();
        assertThat(formationDoctoranleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteFormationDoctoranle() throws Exception {
        // Initialize the database
        formationDoctoranleRepository.saveAndFlush(formationDoctoranle);

        int databaseSizeBeforeDelete = formationDoctoranleRepository.findAll().size();

        // Delete the formationDoctoranle
        restFormationDoctoranleMockMvc
            .perform(delete(ENTITY_API_URL_ID, formationDoctoranle.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<FormationDoctoranle> formationDoctoranleList = formationDoctoranleRepository.findAll();
        assertThat(formationDoctoranleList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
