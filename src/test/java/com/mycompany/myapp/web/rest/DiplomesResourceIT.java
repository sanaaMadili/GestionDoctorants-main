package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Diplomes;
import com.mycompany.myapp.repository.DiplomesRepository;
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
 * Integration tests for the {@link DiplomesResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class DiplomesResourceIT {

    private static final String ENTITY_API_URL = "/api/diplomes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private DiplomesRepository diplomesRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restDiplomesMockMvc;

    private Diplomes diplomes;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Diplomes createEntity(EntityManager em) {
        Diplomes diplomes = new Diplomes();
        return diplomes;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Diplomes createUpdatedEntity(EntityManager em) {
        Diplomes diplomes = new Diplomes();
        return diplomes;
    }

    @BeforeEach
    public void initTest() {
        diplomes = createEntity(em);
    }

    @Test
    @Transactional
    void createDiplomes() throws Exception {
        int databaseSizeBeforeCreate = diplomesRepository.findAll().size();
        // Create the Diplomes
        restDiplomesMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(diplomes))
            )
            .andExpect(status().isCreated());

        // Validate the Diplomes in the database
        List<Diplomes> diplomesList = diplomesRepository.findAll();
        assertThat(diplomesList).hasSize(databaseSizeBeforeCreate + 1);
        Diplomes testDiplomes = diplomesList.get(diplomesList.size() - 1);
    }

    @Test
    @Transactional
    void createDiplomesWithExistingId() throws Exception {
        // Create the Diplomes with an existing ID
        diplomes.setId(1L);

        int databaseSizeBeforeCreate = diplomesRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restDiplomesMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(diplomes))
            )
            .andExpect(status().isBadRequest());

        // Validate the Diplomes in the database
        List<Diplomes> diplomesList = diplomesRepository.findAll();
        assertThat(diplomesList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllDiplomes() throws Exception {
        // Initialize the database
        diplomesRepository.saveAndFlush(diplomes);

        // Get all the diplomesList
        restDiplomesMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(diplomes.getId().intValue())));
    }

    @Test
    @Transactional
    void getDiplomes() throws Exception {
        // Initialize the database
        diplomesRepository.saveAndFlush(diplomes);

        // Get the diplomes
        restDiplomesMockMvc
            .perform(get(ENTITY_API_URL_ID, diplomes.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(diplomes.getId().intValue()));
    }

    @Test
    @Transactional
    void getNonExistingDiplomes() throws Exception {
        // Get the diplomes
        restDiplomesMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewDiplomes() throws Exception {
        // Initialize the database
        diplomesRepository.saveAndFlush(diplomes);

        int databaseSizeBeforeUpdate = diplomesRepository.findAll().size();

        // Update the diplomes
        Diplomes updatedDiplomes = diplomesRepository.findById(diplomes.getId()).get();
        // Disconnect from session so that the updates on updatedDiplomes are not directly saved in db
        em.detach(updatedDiplomes);

        restDiplomesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedDiplomes.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedDiplomes))
            )
            .andExpect(status().isOk());

        // Validate the Diplomes in the database
        List<Diplomes> diplomesList = diplomesRepository.findAll();
        assertThat(diplomesList).hasSize(databaseSizeBeforeUpdate);
        Diplomes testDiplomes = diplomesList.get(diplomesList.size() - 1);
    }

    @Test
    @Transactional
    void putNonExistingDiplomes() throws Exception {
        int databaseSizeBeforeUpdate = diplomesRepository.findAll().size();
        diplomes.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDiplomesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, diplomes.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(diplomes))
            )
            .andExpect(status().isBadRequest());

        // Validate the Diplomes in the database
        List<Diplomes> diplomesList = diplomesRepository.findAll();
        assertThat(diplomesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchDiplomes() throws Exception {
        int databaseSizeBeforeUpdate = diplomesRepository.findAll().size();
        diplomes.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDiplomesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(diplomes))
            )
            .andExpect(status().isBadRequest());

        // Validate the Diplomes in the database
        List<Diplomes> diplomesList = diplomesRepository.findAll();
        assertThat(diplomesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamDiplomes() throws Exception {
        int databaseSizeBeforeUpdate = diplomesRepository.findAll().size();
        diplomes.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDiplomesMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(diplomes))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Diplomes in the database
        List<Diplomes> diplomesList = diplomesRepository.findAll();
        assertThat(diplomesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateDiplomesWithPatch() throws Exception {
        // Initialize the database
        diplomesRepository.saveAndFlush(diplomes);

        int databaseSizeBeforeUpdate = diplomesRepository.findAll().size();

        // Update the diplomes using partial update
        Diplomes partialUpdatedDiplomes = new Diplomes();
        partialUpdatedDiplomes.setId(diplomes.getId());

        restDiplomesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDiplomes.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDiplomes))
            )
            .andExpect(status().isOk());

        // Validate the Diplomes in the database
        List<Diplomes> diplomesList = diplomesRepository.findAll();
        assertThat(diplomesList).hasSize(databaseSizeBeforeUpdate);
        Diplomes testDiplomes = diplomesList.get(diplomesList.size() - 1);
    }

    @Test
    @Transactional
    void fullUpdateDiplomesWithPatch() throws Exception {
        // Initialize the database
        diplomesRepository.saveAndFlush(diplomes);

        int databaseSizeBeforeUpdate = diplomesRepository.findAll().size();

        // Update the diplomes using partial update
        Diplomes partialUpdatedDiplomes = new Diplomes();
        partialUpdatedDiplomes.setId(diplomes.getId());

        restDiplomesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDiplomes.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDiplomes))
            )
            .andExpect(status().isOk());

        // Validate the Diplomes in the database
        List<Diplomes> diplomesList = diplomesRepository.findAll();
        assertThat(diplomesList).hasSize(databaseSizeBeforeUpdate);
        Diplomes testDiplomes = diplomesList.get(diplomesList.size() - 1);
    }

    @Test
    @Transactional
    void patchNonExistingDiplomes() throws Exception {
        int databaseSizeBeforeUpdate = diplomesRepository.findAll().size();
        diplomes.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDiplomesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, diplomes.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(diplomes))
            )
            .andExpect(status().isBadRequest());

        // Validate the Diplomes in the database
        List<Diplomes> diplomesList = diplomesRepository.findAll();
        assertThat(diplomesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchDiplomes() throws Exception {
        int databaseSizeBeforeUpdate = diplomesRepository.findAll().size();
        diplomes.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDiplomesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(diplomes))
            )
            .andExpect(status().isBadRequest());

        // Validate the Diplomes in the database
        List<Diplomes> diplomesList = diplomesRepository.findAll();
        assertThat(diplomesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamDiplomes() throws Exception {
        int databaseSizeBeforeUpdate = diplomesRepository.findAll().size();
        diplomes.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDiplomesMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(diplomes))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Diplomes in the database
        List<Diplomes> diplomesList = diplomesRepository.findAll();
        assertThat(diplomesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteDiplomes() throws Exception {
        // Initialize the database
        diplomesRepository.saveAndFlush(diplomes);

        int databaseSizeBeforeDelete = diplomesRepository.findAll().size();

        // Delete the diplomes
        restDiplomesMockMvc
            .perform(delete(ENTITY_API_URL_ID, diplomes.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Diplomes> diplomesList = diplomesRepository.findAll();
        assertThat(diplomesList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
