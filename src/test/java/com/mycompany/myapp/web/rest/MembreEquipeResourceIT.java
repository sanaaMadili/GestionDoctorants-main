package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.MembreEquipe;
import com.mycompany.myapp.repository.MembreEquipeRepository;
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

/**
 * Integration tests for the {@link MembreEquipeResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class MembreEquipeResourceIT {

    private static final LocalDate DEFAULT_DATE_DEBUT = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE_DEBUT = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_DATEFIN = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATEFIN = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/membre-equipes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private MembreEquipeRepository membreEquipeRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMembreEquipeMockMvc;

    private MembreEquipe membreEquipe;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static MembreEquipe createEntity(EntityManager em) {
        MembreEquipe membreEquipe = new MembreEquipe().dateDebut(DEFAULT_DATE_DEBUT).datefin(DEFAULT_DATEFIN);
        return membreEquipe;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static MembreEquipe createUpdatedEntity(EntityManager em) {
        MembreEquipe membreEquipe = new MembreEquipe().dateDebut(UPDATED_DATE_DEBUT).datefin(UPDATED_DATEFIN);
        return membreEquipe;
    }

    @BeforeEach
    public void initTest() {
        membreEquipe = createEntity(em);
    }

    @Test
    @Transactional
    void createMembreEquipe() throws Exception {
        int databaseSizeBeforeCreate = membreEquipeRepository.findAll().size();
        // Create the MembreEquipe
        restMembreEquipeMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(membreEquipe))
            )
            .andExpect(status().isCreated());

        // Validate the MembreEquipe in the database
        List<MembreEquipe> membreEquipeList = membreEquipeRepository.findAll();
        assertThat(membreEquipeList).hasSize(databaseSizeBeforeCreate + 1);
        MembreEquipe testMembreEquipe = membreEquipeList.get(membreEquipeList.size() - 1);
        assertThat(testMembreEquipe.getDateDebut()).isEqualTo(DEFAULT_DATE_DEBUT);
        assertThat(testMembreEquipe.getDatefin()).isEqualTo(DEFAULT_DATEFIN);
    }

    @Test
    @Transactional
    void createMembreEquipeWithExistingId() throws Exception {
        // Create the MembreEquipe with an existing ID
        membreEquipe.setId(1L);

        int databaseSizeBeforeCreate = membreEquipeRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restMembreEquipeMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(membreEquipe))
            )
            .andExpect(status().isBadRequest());

        // Validate the MembreEquipe in the database
        List<MembreEquipe> membreEquipeList = membreEquipeRepository.findAll();
        assertThat(membreEquipeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkDateDebutIsRequired() throws Exception {
        int databaseSizeBeforeTest = membreEquipeRepository.findAll().size();
        // set the field null
        membreEquipe.setDateDebut(null);

        // Create the MembreEquipe, which fails.

        restMembreEquipeMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(membreEquipe))
            )
            .andExpect(status().isBadRequest());

        List<MembreEquipe> membreEquipeList = membreEquipeRepository.findAll();
        assertThat(membreEquipeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllMembreEquipes() throws Exception {
        // Initialize the database
        membreEquipeRepository.saveAndFlush(membreEquipe);

        // Get all the membreEquipeList
        restMembreEquipeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(membreEquipe.getId().intValue())))
            .andExpect(jsonPath("$.[*].dateDebut").value(hasItem(DEFAULT_DATE_DEBUT.toString())))
            .andExpect(jsonPath("$.[*].datefin").value(hasItem(DEFAULT_DATEFIN.toString())));
    }

    @Test
    @Transactional
    void getMembreEquipe() throws Exception {
        // Initialize the database
        membreEquipeRepository.saveAndFlush(membreEquipe);

        // Get the membreEquipe
        restMembreEquipeMockMvc
            .perform(get(ENTITY_API_URL_ID, membreEquipe.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(membreEquipe.getId().intValue()))
            .andExpect(jsonPath("$.dateDebut").value(DEFAULT_DATE_DEBUT.toString()))
            .andExpect(jsonPath("$.datefin").value(DEFAULT_DATEFIN.toString()));
    }

    @Test
    @Transactional
    void getNonExistingMembreEquipe() throws Exception {
        // Get the membreEquipe
        restMembreEquipeMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewMembreEquipe() throws Exception {
        // Initialize the database
        membreEquipeRepository.saveAndFlush(membreEquipe);

        int databaseSizeBeforeUpdate = membreEquipeRepository.findAll().size();

        // Update the membreEquipe
        MembreEquipe updatedMembreEquipe = membreEquipeRepository.findById(membreEquipe.getId()).get();
        // Disconnect from session so that the updates on updatedMembreEquipe are not directly saved in db
        em.detach(updatedMembreEquipe);
        updatedMembreEquipe.dateDebut(UPDATED_DATE_DEBUT).datefin(UPDATED_DATEFIN);

        restMembreEquipeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedMembreEquipe.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedMembreEquipe))
            )
            .andExpect(status().isOk());

        // Validate the MembreEquipe in the database
        List<MembreEquipe> membreEquipeList = membreEquipeRepository.findAll();
        assertThat(membreEquipeList).hasSize(databaseSizeBeforeUpdate);
        MembreEquipe testMembreEquipe = membreEquipeList.get(membreEquipeList.size() - 1);
        assertThat(testMembreEquipe.getDateDebut()).isEqualTo(UPDATED_DATE_DEBUT);
        assertThat(testMembreEquipe.getDatefin()).isEqualTo(UPDATED_DATEFIN);
    }

    @Test
    @Transactional
    void putNonExistingMembreEquipe() throws Exception {
        int databaseSizeBeforeUpdate = membreEquipeRepository.findAll().size();
        membreEquipe.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMembreEquipeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, membreEquipe.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(membreEquipe))
            )
            .andExpect(status().isBadRequest());

        // Validate the MembreEquipe in the database
        List<MembreEquipe> membreEquipeList = membreEquipeRepository.findAll();
        assertThat(membreEquipeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchMembreEquipe() throws Exception {
        int databaseSizeBeforeUpdate = membreEquipeRepository.findAll().size();
        membreEquipe.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMembreEquipeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(membreEquipe))
            )
            .andExpect(status().isBadRequest());

        // Validate the MembreEquipe in the database
        List<MembreEquipe> membreEquipeList = membreEquipeRepository.findAll();
        assertThat(membreEquipeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamMembreEquipe() throws Exception {
        int databaseSizeBeforeUpdate = membreEquipeRepository.findAll().size();
        membreEquipe.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMembreEquipeMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(membreEquipe))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the MembreEquipe in the database
        List<MembreEquipe> membreEquipeList = membreEquipeRepository.findAll();
        assertThat(membreEquipeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateMembreEquipeWithPatch() throws Exception {
        // Initialize the database
        membreEquipeRepository.saveAndFlush(membreEquipe);

        int databaseSizeBeforeUpdate = membreEquipeRepository.findAll().size();

        // Update the membreEquipe using partial update
        MembreEquipe partialUpdatedMembreEquipe = new MembreEquipe();
        partialUpdatedMembreEquipe.setId(membreEquipe.getId());

        partialUpdatedMembreEquipe.datefin(UPDATED_DATEFIN);

        restMembreEquipeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMembreEquipe.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMembreEquipe))
            )
            .andExpect(status().isOk());

        // Validate the MembreEquipe in the database
        List<MembreEquipe> membreEquipeList = membreEquipeRepository.findAll();
        assertThat(membreEquipeList).hasSize(databaseSizeBeforeUpdate);
        MembreEquipe testMembreEquipe = membreEquipeList.get(membreEquipeList.size() - 1);
        assertThat(testMembreEquipe.getDateDebut()).isEqualTo(DEFAULT_DATE_DEBUT);
        assertThat(testMembreEquipe.getDatefin()).isEqualTo(UPDATED_DATEFIN);
    }

    @Test
    @Transactional
    void fullUpdateMembreEquipeWithPatch() throws Exception {
        // Initialize the database
        membreEquipeRepository.saveAndFlush(membreEquipe);

        int databaseSizeBeforeUpdate = membreEquipeRepository.findAll().size();

        // Update the membreEquipe using partial update
        MembreEquipe partialUpdatedMembreEquipe = new MembreEquipe();
        partialUpdatedMembreEquipe.setId(membreEquipe.getId());

        partialUpdatedMembreEquipe.dateDebut(UPDATED_DATE_DEBUT).datefin(UPDATED_DATEFIN);

        restMembreEquipeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMembreEquipe.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMembreEquipe))
            )
            .andExpect(status().isOk());

        // Validate the MembreEquipe in the database
        List<MembreEquipe> membreEquipeList = membreEquipeRepository.findAll();
        assertThat(membreEquipeList).hasSize(databaseSizeBeforeUpdate);
        MembreEquipe testMembreEquipe = membreEquipeList.get(membreEquipeList.size() - 1);
        assertThat(testMembreEquipe.getDateDebut()).isEqualTo(UPDATED_DATE_DEBUT);
        assertThat(testMembreEquipe.getDatefin()).isEqualTo(UPDATED_DATEFIN);
    }

    @Test
    @Transactional
    void patchNonExistingMembreEquipe() throws Exception {
        int databaseSizeBeforeUpdate = membreEquipeRepository.findAll().size();
        membreEquipe.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMembreEquipeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, membreEquipe.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(membreEquipe))
            )
            .andExpect(status().isBadRequest());

        // Validate the MembreEquipe in the database
        List<MembreEquipe> membreEquipeList = membreEquipeRepository.findAll();
        assertThat(membreEquipeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchMembreEquipe() throws Exception {
        int databaseSizeBeforeUpdate = membreEquipeRepository.findAll().size();
        membreEquipe.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMembreEquipeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(membreEquipe))
            )
            .andExpect(status().isBadRequest());

        // Validate the MembreEquipe in the database
        List<MembreEquipe> membreEquipeList = membreEquipeRepository.findAll();
        assertThat(membreEquipeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamMembreEquipe() throws Exception {
        int databaseSizeBeforeUpdate = membreEquipeRepository.findAll().size();
        membreEquipe.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMembreEquipeMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(membreEquipe))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the MembreEquipe in the database
        List<MembreEquipe> membreEquipeList = membreEquipeRepository.findAll();
        assertThat(membreEquipeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteMembreEquipe() throws Exception {
        // Initialize the database
        membreEquipeRepository.saveAndFlush(membreEquipe);

        int databaseSizeBeforeDelete = membreEquipeRepository.findAll().size();

        // Delete the membreEquipe
        restMembreEquipeMockMvc
            .perform(delete(ENTITY_API_URL_ID, membreEquipe.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<MembreEquipe> membreEquipeList = membreEquipeRepository.findAll();
        assertThat(membreEquipeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
