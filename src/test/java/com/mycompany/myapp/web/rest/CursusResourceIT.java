package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Cursus;
import com.mycompany.myapp.repository.CursusRepository;
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
 * Integration tests for the {@link CursusResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CursusResourceIT {

    private static final String DEFAULT_NOM = "AAAAAAAAAA";
    private static final String UPDATED_NOM = "BBBBBBBBBB";

    private static final Integer DEFAULT_NB_FORMATION = 1;
    private static final Integer UPDATED_NB_FORMATION = 2;

    private static final String ENTITY_API_URL = "/api/cursuses";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CursusRepository cursusRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCursusMockMvc;

    private Cursus cursus;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Cursus createEntity(EntityManager em) {
        Cursus cursus = new Cursus().nom(DEFAULT_NOM).nbFormation(DEFAULT_NB_FORMATION);
        return cursus;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Cursus createUpdatedEntity(EntityManager em) {
        Cursus cursus = new Cursus().nom(UPDATED_NOM).nbFormation(UPDATED_NB_FORMATION);
        return cursus;
    }

    @BeforeEach
    public void initTest() {
        cursus = createEntity(em);
    }

    @Test
    @Transactional
    void createCursus() throws Exception {
        int databaseSizeBeforeCreate = cursusRepository.findAll().size();
        // Create the Cursus
        restCursusMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(cursus))
            )
            .andExpect(status().isCreated());

        // Validate the Cursus in the database
        List<Cursus> cursusList = cursusRepository.findAll();
        assertThat(cursusList).hasSize(databaseSizeBeforeCreate + 1);
        Cursus testCursus = cursusList.get(cursusList.size() - 1);
        assertThat(testCursus.getNom()).isEqualTo(DEFAULT_NOM);
        assertThat(testCursus.getNbFormation()).isEqualTo(DEFAULT_NB_FORMATION);
    }

    @Test
    @Transactional
    void createCursusWithExistingId() throws Exception {
        // Create the Cursus with an existing ID
        cursus.setId(1L);

        int databaseSizeBeforeCreate = cursusRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCursusMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(cursus))
            )
            .andExpect(status().isBadRequest());

        // Validate the Cursus in the database
        List<Cursus> cursusList = cursusRepository.findAll();
        assertThat(cursusList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllCursuses() throws Exception {
        // Initialize the database
        cursusRepository.saveAndFlush(cursus);

        // Get all the cursusList
        restCursusMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(cursus.getId().intValue())))
            .andExpect(jsonPath("$.[*].nom").value(hasItem(DEFAULT_NOM)))
            .andExpect(jsonPath("$.[*].nbFormation").value(hasItem(DEFAULT_NB_FORMATION)));
    }

    @Test
    @Transactional
    void getCursus() throws Exception {
        // Initialize the database
        cursusRepository.saveAndFlush(cursus);

        // Get the cursus
        restCursusMockMvc
            .perform(get(ENTITY_API_URL_ID, cursus.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(cursus.getId().intValue()))
            .andExpect(jsonPath("$.nom").value(DEFAULT_NOM))
            .andExpect(jsonPath("$.nbFormation").value(DEFAULT_NB_FORMATION));
    }

    @Test
    @Transactional
    void getNonExistingCursus() throws Exception {
        // Get the cursus
        restCursusMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewCursus() throws Exception {
        // Initialize the database
        cursusRepository.saveAndFlush(cursus);

        int databaseSizeBeforeUpdate = cursusRepository.findAll().size();

        // Update the cursus
        Cursus updatedCursus = cursusRepository.findById(cursus.getId()).get();
        // Disconnect from session so that the updates on updatedCursus are not directly saved in db
        em.detach(updatedCursus);
        updatedCursus.nom(UPDATED_NOM).nbFormation(UPDATED_NB_FORMATION);

        restCursusMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCursus.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCursus))
            )
            .andExpect(status().isOk());

        // Validate the Cursus in the database
        List<Cursus> cursusList = cursusRepository.findAll();
        assertThat(cursusList).hasSize(databaseSizeBeforeUpdate);
        Cursus testCursus = cursusList.get(cursusList.size() - 1);
        assertThat(testCursus.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testCursus.getNbFormation()).isEqualTo(UPDATED_NB_FORMATION);
    }

    @Test
    @Transactional
    void putNonExistingCursus() throws Exception {
        int databaseSizeBeforeUpdate = cursusRepository.findAll().size();
        cursus.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCursusMockMvc
            .perform(
                put(ENTITY_API_URL_ID, cursus.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(cursus))
            )
            .andExpect(status().isBadRequest());

        // Validate the Cursus in the database
        List<Cursus> cursusList = cursusRepository.findAll();
        assertThat(cursusList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCursus() throws Exception {
        int databaseSizeBeforeUpdate = cursusRepository.findAll().size();
        cursus.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCursusMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(cursus))
            )
            .andExpect(status().isBadRequest());

        // Validate the Cursus in the database
        List<Cursus> cursusList = cursusRepository.findAll();
        assertThat(cursusList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCursus() throws Exception {
        int databaseSizeBeforeUpdate = cursusRepository.findAll().size();
        cursus.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCursusMockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(cursus))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Cursus in the database
        List<Cursus> cursusList = cursusRepository.findAll();
        assertThat(cursusList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCursusWithPatch() throws Exception {
        // Initialize the database
        cursusRepository.saveAndFlush(cursus);

        int databaseSizeBeforeUpdate = cursusRepository.findAll().size();

        // Update the cursus using partial update
        Cursus partialUpdatedCursus = new Cursus();
        partialUpdatedCursus.setId(cursus.getId());

        restCursusMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCursus.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCursus))
            )
            .andExpect(status().isOk());

        // Validate the Cursus in the database
        List<Cursus> cursusList = cursusRepository.findAll();
        assertThat(cursusList).hasSize(databaseSizeBeforeUpdate);
        Cursus testCursus = cursusList.get(cursusList.size() - 1);
        assertThat(testCursus.getNom()).isEqualTo(DEFAULT_NOM);
        assertThat(testCursus.getNbFormation()).isEqualTo(DEFAULT_NB_FORMATION);
    }

    @Test
    @Transactional
    void fullUpdateCursusWithPatch() throws Exception {
        // Initialize the database
        cursusRepository.saveAndFlush(cursus);

        int databaseSizeBeforeUpdate = cursusRepository.findAll().size();

        // Update the cursus using partial update
        Cursus partialUpdatedCursus = new Cursus();
        partialUpdatedCursus.setId(cursus.getId());

        partialUpdatedCursus.nom(UPDATED_NOM).nbFormation(UPDATED_NB_FORMATION);

        restCursusMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCursus.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCursus))
            )
            .andExpect(status().isOk());

        // Validate the Cursus in the database
        List<Cursus> cursusList = cursusRepository.findAll();
        assertThat(cursusList).hasSize(databaseSizeBeforeUpdate);
        Cursus testCursus = cursusList.get(cursusList.size() - 1);
        assertThat(testCursus.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testCursus.getNbFormation()).isEqualTo(UPDATED_NB_FORMATION);
    }

    @Test
    @Transactional
    void patchNonExistingCursus() throws Exception {
        int databaseSizeBeforeUpdate = cursusRepository.findAll().size();
        cursus.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCursusMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, cursus.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(cursus))
            )
            .andExpect(status().isBadRequest());

        // Validate the Cursus in the database
        List<Cursus> cursusList = cursusRepository.findAll();
        assertThat(cursusList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCursus() throws Exception {
        int databaseSizeBeforeUpdate = cursusRepository.findAll().size();
        cursus.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCursusMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(cursus))
            )
            .andExpect(status().isBadRequest());

        // Validate the Cursus in the database
        List<Cursus> cursusList = cursusRepository.findAll();
        assertThat(cursusList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCursus() throws Exception {
        int databaseSizeBeforeUpdate = cursusRepository.findAll().size();
        cursus.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCursusMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(cursus))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Cursus in the database
        List<Cursus> cursusList = cursusRepository.findAll();
        assertThat(cursusList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCursus() throws Exception {
        // Initialize the database
        cursusRepository.saveAndFlush(cursus);

        int databaseSizeBeforeDelete = cursusRepository.findAll().size();

        // Delete the cursus
        restCursusMockMvc
            .perform(delete(ENTITY_API_URL_ID, cursus.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Cursus> cursusList = cursusRepository.findAll();
        assertThat(cursusList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
