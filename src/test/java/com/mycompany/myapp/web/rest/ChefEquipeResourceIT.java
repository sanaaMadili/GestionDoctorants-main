package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.ChefEquipe;
import com.mycompany.myapp.repository.ChefEquipeRepository;
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
 * Integration tests for the {@link ChefEquipeResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ChefEquipeResourceIT {

    private static final LocalDate DEFAULT_DATE_DEBUT = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE_DEBUT = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_DATE_FIN = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE_FIN = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/chef-equipes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ChefEquipeRepository chefEquipeRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restChefEquipeMockMvc;

    private ChefEquipe chefEquipe;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ChefEquipe createEntity(EntityManager em) {
        ChefEquipe chefEquipe = new ChefEquipe().dateDebut(DEFAULT_DATE_DEBUT).dateFin(DEFAULT_DATE_FIN);
        return chefEquipe;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ChefEquipe createUpdatedEntity(EntityManager em) {
        ChefEquipe chefEquipe = new ChefEquipe().dateDebut(UPDATED_DATE_DEBUT).dateFin(UPDATED_DATE_FIN);
        return chefEquipe;
    }

    @BeforeEach
    public void initTest() {
        chefEquipe = createEntity(em);
    }

    @Test
    @Transactional
    void createChefEquipe() throws Exception {
        int databaseSizeBeforeCreate = chefEquipeRepository.findAll().size();
        // Create the ChefEquipe
        restChefEquipeMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(chefEquipe))
            )
            .andExpect(status().isCreated());

        // Validate the ChefEquipe in the database
        List<ChefEquipe> chefEquipeList = chefEquipeRepository.findAll();
        assertThat(chefEquipeList).hasSize(databaseSizeBeforeCreate + 1);
        ChefEquipe testChefEquipe = chefEquipeList.get(chefEquipeList.size() - 1);
        assertThat(testChefEquipe.getDateDebut()).isEqualTo(DEFAULT_DATE_DEBUT);
        assertThat(testChefEquipe.getDateFin()).isEqualTo(DEFAULT_DATE_FIN);
    }

    @Test
    @Transactional
    void createChefEquipeWithExistingId() throws Exception {
        // Create the ChefEquipe with an existing ID
        chefEquipe.setId(1L);

        int databaseSizeBeforeCreate = chefEquipeRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restChefEquipeMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(chefEquipe))
            )
            .andExpect(status().isBadRequest());

        // Validate the ChefEquipe in the database
        List<ChefEquipe> chefEquipeList = chefEquipeRepository.findAll();
        assertThat(chefEquipeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkDateDebutIsRequired() throws Exception {
        int databaseSizeBeforeTest = chefEquipeRepository.findAll().size();
        // set the field null
        chefEquipe.setDateDebut(null);

        // Create the ChefEquipe, which fails.

        restChefEquipeMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(chefEquipe))
            )
            .andExpect(status().isBadRequest());

        List<ChefEquipe> chefEquipeList = chefEquipeRepository.findAll();
        assertThat(chefEquipeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkDateFinIsRequired() throws Exception {
        int databaseSizeBeforeTest = chefEquipeRepository.findAll().size();
        // set the field null
        chefEquipe.setDateFin(null);

        // Create the ChefEquipe, which fails.

        restChefEquipeMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(chefEquipe))
            )
            .andExpect(status().isBadRequest());

        List<ChefEquipe> chefEquipeList = chefEquipeRepository.findAll();
        assertThat(chefEquipeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllChefEquipes() throws Exception {
        // Initialize the database
        chefEquipeRepository.saveAndFlush(chefEquipe);

        // Get all the chefEquipeList
        restChefEquipeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(chefEquipe.getId().intValue())))
            .andExpect(jsonPath("$.[*].dateDebut").value(hasItem(DEFAULT_DATE_DEBUT.toString())))
            .andExpect(jsonPath("$.[*].dateFin").value(hasItem(DEFAULT_DATE_FIN.toString())));
    }

    @Test
    @Transactional
    void getChefEquipe() throws Exception {
        // Initialize the database
        chefEquipeRepository.saveAndFlush(chefEquipe);

        // Get the chefEquipe
        restChefEquipeMockMvc
            .perform(get(ENTITY_API_URL_ID, chefEquipe.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(chefEquipe.getId().intValue()))
            .andExpect(jsonPath("$.dateDebut").value(DEFAULT_DATE_DEBUT.toString()))
            .andExpect(jsonPath("$.dateFin").value(DEFAULT_DATE_FIN.toString()));
    }

    @Test
    @Transactional
    void getNonExistingChefEquipe() throws Exception {
        // Get the chefEquipe
        restChefEquipeMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewChefEquipe() throws Exception {
        // Initialize the database
        chefEquipeRepository.saveAndFlush(chefEquipe);

        int databaseSizeBeforeUpdate = chefEquipeRepository.findAll().size();

        // Update the chefEquipe
        ChefEquipe updatedChefEquipe = chefEquipeRepository.findById(chefEquipe.getId()).get();
        // Disconnect from session so that the updates on updatedChefEquipe are not directly saved in db
        em.detach(updatedChefEquipe);
        updatedChefEquipe.dateDebut(UPDATED_DATE_DEBUT).dateFin(UPDATED_DATE_FIN);

        restChefEquipeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedChefEquipe.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedChefEquipe))
            )
            .andExpect(status().isOk());

        // Validate the ChefEquipe in the database
        List<ChefEquipe> chefEquipeList = chefEquipeRepository.findAll();
        assertThat(chefEquipeList).hasSize(databaseSizeBeforeUpdate);
        ChefEquipe testChefEquipe = chefEquipeList.get(chefEquipeList.size() - 1);
        assertThat(testChefEquipe.getDateDebut()).isEqualTo(UPDATED_DATE_DEBUT);
        assertThat(testChefEquipe.getDateFin()).isEqualTo(UPDATED_DATE_FIN);
    }

    @Test
    @Transactional
    void putNonExistingChefEquipe() throws Exception {
        int databaseSizeBeforeUpdate = chefEquipeRepository.findAll().size();
        chefEquipe.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restChefEquipeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, chefEquipe.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(chefEquipe))
            )
            .andExpect(status().isBadRequest());

        // Validate the ChefEquipe in the database
        List<ChefEquipe> chefEquipeList = chefEquipeRepository.findAll();
        assertThat(chefEquipeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchChefEquipe() throws Exception {
        int databaseSizeBeforeUpdate = chefEquipeRepository.findAll().size();
        chefEquipe.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChefEquipeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(chefEquipe))
            )
            .andExpect(status().isBadRequest());

        // Validate the ChefEquipe in the database
        List<ChefEquipe> chefEquipeList = chefEquipeRepository.findAll();
        assertThat(chefEquipeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamChefEquipe() throws Exception {
        int databaseSizeBeforeUpdate = chefEquipeRepository.findAll().size();
        chefEquipe.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChefEquipeMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(chefEquipe))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ChefEquipe in the database
        List<ChefEquipe> chefEquipeList = chefEquipeRepository.findAll();
        assertThat(chefEquipeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateChefEquipeWithPatch() throws Exception {
        // Initialize the database
        chefEquipeRepository.saveAndFlush(chefEquipe);

        int databaseSizeBeforeUpdate = chefEquipeRepository.findAll().size();

        // Update the chefEquipe using partial update
        ChefEquipe partialUpdatedChefEquipe = new ChefEquipe();
        partialUpdatedChefEquipe.setId(chefEquipe.getId());

        restChefEquipeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedChefEquipe.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedChefEquipe))
            )
            .andExpect(status().isOk());

        // Validate the ChefEquipe in the database
        List<ChefEquipe> chefEquipeList = chefEquipeRepository.findAll();
        assertThat(chefEquipeList).hasSize(databaseSizeBeforeUpdate);
        ChefEquipe testChefEquipe = chefEquipeList.get(chefEquipeList.size() - 1);
        assertThat(testChefEquipe.getDateDebut()).isEqualTo(DEFAULT_DATE_DEBUT);
        assertThat(testChefEquipe.getDateFin()).isEqualTo(DEFAULT_DATE_FIN);
    }

    @Test
    @Transactional
    void fullUpdateChefEquipeWithPatch() throws Exception {
        // Initialize the database
        chefEquipeRepository.saveAndFlush(chefEquipe);

        int databaseSizeBeforeUpdate = chefEquipeRepository.findAll().size();

        // Update the chefEquipe using partial update
        ChefEquipe partialUpdatedChefEquipe = new ChefEquipe();
        partialUpdatedChefEquipe.setId(chefEquipe.getId());

        partialUpdatedChefEquipe.dateDebut(UPDATED_DATE_DEBUT).dateFin(UPDATED_DATE_FIN);

        restChefEquipeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedChefEquipe.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedChefEquipe))
            )
            .andExpect(status().isOk());

        // Validate the ChefEquipe in the database
        List<ChefEquipe> chefEquipeList = chefEquipeRepository.findAll();
        assertThat(chefEquipeList).hasSize(databaseSizeBeforeUpdate);
        ChefEquipe testChefEquipe = chefEquipeList.get(chefEquipeList.size() - 1);
        assertThat(testChefEquipe.getDateDebut()).isEqualTo(UPDATED_DATE_DEBUT);
        assertThat(testChefEquipe.getDateFin()).isEqualTo(UPDATED_DATE_FIN);
    }

    @Test
    @Transactional
    void patchNonExistingChefEquipe() throws Exception {
        int databaseSizeBeforeUpdate = chefEquipeRepository.findAll().size();
        chefEquipe.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restChefEquipeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, chefEquipe.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(chefEquipe))
            )
            .andExpect(status().isBadRequest());

        // Validate the ChefEquipe in the database
        List<ChefEquipe> chefEquipeList = chefEquipeRepository.findAll();
        assertThat(chefEquipeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchChefEquipe() throws Exception {
        int databaseSizeBeforeUpdate = chefEquipeRepository.findAll().size();
        chefEquipe.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChefEquipeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(chefEquipe))
            )
            .andExpect(status().isBadRequest());

        // Validate the ChefEquipe in the database
        List<ChefEquipe> chefEquipeList = chefEquipeRepository.findAll();
        assertThat(chefEquipeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamChefEquipe() throws Exception {
        int databaseSizeBeforeUpdate = chefEquipeRepository.findAll().size();
        chefEquipe.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChefEquipeMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(chefEquipe))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ChefEquipe in the database
        List<ChefEquipe> chefEquipeList = chefEquipeRepository.findAll();
        assertThat(chefEquipeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteChefEquipe() throws Exception {
        // Initialize the database
        chefEquipeRepository.saveAndFlush(chefEquipe);

        int databaseSizeBeforeDelete = chefEquipeRepository.findAll().size();

        // Delete the chefEquipe
        restChefEquipeMockMvc
            .perform(delete(ENTITY_API_URL_ID, chefEquipe.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ChefEquipe> chefEquipeList = chefEquipeRepository.findAll();
        assertThat(chefEquipeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
