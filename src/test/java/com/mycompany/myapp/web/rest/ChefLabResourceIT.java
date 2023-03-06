package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.ChefLab;
import com.mycompany.myapp.repository.ChefLabRepository;
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
 * Integration tests for the {@link ChefLabResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ChefLabResourceIT {

    private static final LocalDate DEFAULT_DATE_DEBUT = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE_DEBUT = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_DATE_FIN = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE_FIN = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/chef-labs";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ChefLabRepository chefLabRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restChefLabMockMvc;

    private ChefLab chefLab;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ChefLab createEntity(EntityManager em) {
        ChefLab chefLab = new ChefLab().dateDebut(DEFAULT_DATE_DEBUT).dateFin(DEFAULT_DATE_FIN);
        return chefLab;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ChefLab createUpdatedEntity(EntityManager em) {
        ChefLab chefLab = new ChefLab().dateDebut(UPDATED_DATE_DEBUT).dateFin(UPDATED_DATE_FIN);
        return chefLab;
    }

    @BeforeEach
    public void initTest() {
        chefLab = createEntity(em);
    }

    @Test
    @Transactional
    void createChefLab() throws Exception {
        int databaseSizeBeforeCreate = chefLabRepository.findAll().size();
        // Create the ChefLab
        restChefLabMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(chefLab))
            )
            .andExpect(status().isCreated());

        // Validate the ChefLab in the database
        List<ChefLab> chefLabList = chefLabRepository.findAll();
        assertThat(chefLabList).hasSize(databaseSizeBeforeCreate + 1);
        ChefLab testChefLab = chefLabList.get(chefLabList.size() - 1);
        assertThat(testChefLab.getDateDebut()).isEqualTo(DEFAULT_DATE_DEBUT);
        assertThat(testChefLab.getDateFin()).isEqualTo(DEFAULT_DATE_FIN);
    }

    @Test
    @Transactional
    void createChefLabWithExistingId() throws Exception {
        // Create the ChefLab with an existing ID
        chefLab.setId(1L);

        int databaseSizeBeforeCreate = chefLabRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restChefLabMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(chefLab))
            )
            .andExpect(status().isBadRequest());

        // Validate the ChefLab in the database
        List<ChefLab> chefLabList = chefLabRepository.findAll();
        assertThat(chefLabList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkDateDebutIsRequired() throws Exception {
        int databaseSizeBeforeTest = chefLabRepository.findAll().size();
        // set the field null
        chefLab.setDateDebut(null);

        // Create the ChefLab, which fails.

        restChefLabMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(chefLab))
            )
            .andExpect(status().isBadRequest());

        List<ChefLab> chefLabList = chefLabRepository.findAll();
        assertThat(chefLabList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkDateFinIsRequired() throws Exception {
        int databaseSizeBeforeTest = chefLabRepository.findAll().size();
        // set the field null
        chefLab.setDateFin(null);

        // Create the ChefLab, which fails.

        restChefLabMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(chefLab))
            )
            .andExpect(status().isBadRequest());

        List<ChefLab> chefLabList = chefLabRepository.findAll();
        assertThat(chefLabList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllChefLabs() throws Exception {
        // Initialize the database
        chefLabRepository.saveAndFlush(chefLab);

        // Get all the chefLabList
        restChefLabMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(chefLab.getId().intValue())))
            .andExpect(jsonPath("$.[*].dateDebut").value(hasItem(DEFAULT_DATE_DEBUT.toString())))
            .andExpect(jsonPath("$.[*].dateFin").value(hasItem(DEFAULT_DATE_FIN.toString())));
    }

    @Test
    @Transactional
    void getChefLab() throws Exception {
        // Initialize the database
        chefLabRepository.saveAndFlush(chefLab);

        // Get the chefLab
        restChefLabMockMvc
            .perform(get(ENTITY_API_URL_ID, chefLab.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(chefLab.getId().intValue()))
            .andExpect(jsonPath("$.dateDebut").value(DEFAULT_DATE_DEBUT.toString()))
            .andExpect(jsonPath("$.dateFin").value(DEFAULT_DATE_FIN.toString()));
    }

    @Test
    @Transactional
    void getNonExistingChefLab() throws Exception {
        // Get the chefLab
        restChefLabMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewChefLab() throws Exception {
        // Initialize the database
        chefLabRepository.saveAndFlush(chefLab);

        int databaseSizeBeforeUpdate = chefLabRepository.findAll().size();

        // Update the chefLab
        ChefLab updatedChefLab = chefLabRepository.findById(chefLab.getId()).get();
        // Disconnect from session so that the updates on updatedChefLab are not directly saved in db
        em.detach(updatedChefLab);
        updatedChefLab.dateDebut(UPDATED_DATE_DEBUT).dateFin(UPDATED_DATE_FIN);

        restChefLabMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedChefLab.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedChefLab))
            )
            .andExpect(status().isOk());

        // Validate the ChefLab in the database
        List<ChefLab> chefLabList = chefLabRepository.findAll();
        assertThat(chefLabList).hasSize(databaseSizeBeforeUpdate);
        ChefLab testChefLab = chefLabList.get(chefLabList.size() - 1);
        assertThat(testChefLab.getDateDebut()).isEqualTo(UPDATED_DATE_DEBUT);
        assertThat(testChefLab.getDateFin()).isEqualTo(UPDATED_DATE_FIN);
    }

    @Test
    @Transactional
    void putNonExistingChefLab() throws Exception {
        int databaseSizeBeforeUpdate = chefLabRepository.findAll().size();
        chefLab.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restChefLabMockMvc
            .perform(
                put(ENTITY_API_URL_ID, chefLab.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(chefLab))
            )
            .andExpect(status().isBadRequest());

        // Validate the ChefLab in the database
        List<ChefLab> chefLabList = chefLabRepository.findAll();
        assertThat(chefLabList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchChefLab() throws Exception {
        int databaseSizeBeforeUpdate = chefLabRepository.findAll().size();
        chefLab.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChefLabMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(chefLab))
            )
            .andExpect(status().isBadRequest());

        // Validate the ChefLab in the database
        List<ChefLab> chefLabList = chefLabRepository.findAll();
        assertThat(chefLabList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamChefLab() throws Exception {
        int databaseSizeBeforeUpdate = chefLabRepository.findAll().size();
        chefLab.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChefLabMockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(chefLab))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ChefLab in the database
        List<ChefLab> chefLabList = chefLabRepository.findAll();
        assertThat(chefLabList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateChefLabWithPatch() throws Exception {
        // Initialize the database
        chefLabRepository.saveAndFlush(chefLab);

        int databaseSizeBeforeUpdate = chefLabRepository.findAll().size();

        // Update the chefLab using partial update
        ChefLab partialUpdatedChefLab = new ChefLab();
        partialUpdatedChefLab.setId(chefLab.getId());

        partialUpdatedChefLab.dateDebut(UPDATED_DATE_DEBUT);

        restChefLabMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedChefLab.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedChefLab))
            )
            .andExpect(status().isOk());

        // Validate the ChefLab in the database
        List<ChefLab> chefLabList = chefLabRepository.findAll();
        assertThat(chefLabList).hasSize(databaseSizeBeforeUpdate);
        ChefLab testChefLab = chefLabList.get(chefLabList.size() - 1);
        assertThat(testChefLab.getDateDebut()).isEqualTo(UPDATED_DATE_DEBUT);
        assertThat(testChefLab.getDateFin()).isEqualTo(DEFAULT_DATE_FIN);
    }

    @Test
    @Transactional
    void fullUpdateChefLabWithPatch() throws Exception {
        // Initialize the database
        chefLabRepository.saveAndFlush(chefLab);

        int databaseSizeBeforeUpdate = chefLabRepository.findAll().size();

        // Update the chefLab using partial update
        ChefLab partialUpdatedChefLab = new ChefLab();
        partialUpdatedChefLab.setId(chefLab.getId());

        partialUpdatedChefLab.dateDebut(UPDATED_DATE_DEBUT).dateFin(UPDATED_DATE_FIN);

        restChefLabMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedChefLab.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedChefLab))
            )
            .andExpect(status().isOk());

        // Validate the ChefLab in the database
        List<ChefLab> chefLabList = chefLabRepository.findAll();
        assertThat(chefLabList).hasSize(databaseSizeBeforeUpdate);
        ChefLab testChefLab = chefLabList.get(chefLabList.size() - 1);
        assertThat(testChefLab.getDateDebut()).isEqualTo(UPDATED_DATE_DEBUT);
        assertThat(testChefLab.getDateFin()).isEqualTo(UPDATED_DATE_FIN);
    }

    @Test
    @Transactional
    void patchNonExistingChefLab() throws Exception {
        int databaseSizeBeforeUpdate = chefLabRepository.findAll().size();
        chefLab.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restChefLabMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, chefLab.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(chefLab))
            )
            .andExpect(status().isBadRequest());

        // Validate the ChefLab in the database
        List<ChefLab> chefLabList = chefLabRepository.findAll();
        assertThat(chefLabList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchChefLab() throws Exception {
        int databaseSizeBeforeUpdate = chefLabRepository.findAll().size();
        chefLab.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChefLabMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(chefLab))
            )
            .andExpect(status().isBadRequest());

        // Validate the ChefLab in the database
        List<ChefLab> chefLabList = chefLabRepository.findAll();
        assertThat(chefLabList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamChefLab() throws Exception {
        int databaseSizeBeforeUpdate = chefLabRepository.findAll().size();
        chefLab.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChefLabMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(chefLab))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ChefLab in the database
        List<ChefLab> chefLabList = chefLabRepository.findAll();
        assertThat(chefLabList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteChefLab() throws Exception {
        // Initialize the database
        chefLabRepository.saveAndFlush(chefLab);

        int databaseSizeBeforeDelete = chefLabRepository.findAll().size();

        // Delete the chefLab
        restChefLabMockMvc
            .perform(delete(ENTITY_API_URL_ID, chefLab.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ChefLab> chefLabList = chefLabRepository.findAll();
        assertThat(chefLabList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
