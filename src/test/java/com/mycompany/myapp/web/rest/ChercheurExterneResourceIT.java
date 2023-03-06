package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.ChercheurExterne;
import com.mycompany.myapp.repository.ChercheurExterneRepository;
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
 * Integration tests for the {@link ChercheurExterneResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ChercheurExterneResourceIT {

    private static final String DEFAULT_NOM = "AAAAAAAAAA";
    private static final String UPDATED_NOM = "BBBBBBBBBB";

    private static final String DEFAULT_PRENOM = "AAAAAAAAAA";
    private static final String UPDATED_PRENOM = "BBBBBBBBBB";

    private static final String DEFAULT_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_EMAIL = "BBBBBBBBBB";

    private static final String DEFAULT_PAYS = "AAAAAAAAAA";
    private static final String UPDATED_PAYS = "BBBBBBBBBB";

    private static final String DEFAULT_UNIVERSITE = "AAAAAAAAAA";
    private static final String UPDATED_UNIVERSITE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/chercheur-externes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ChercheurExterneRepository chercheurExterneRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restChercheurExterneMockMvc;

    private ChercheurExterne chercheurExterne;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ChercheurExterne createEntity(EntityManager em) {
        ChercheurExterne chercheurExterne = new ChercheurExterne()
            .nom(DEFAULT_NOM)
            .prenom(DEFAULT_PRENOM)
            .email(DEFAULT_EMAIL)
            .pays(DEFAULT_PAYS)
            .universite(DEFAULT_UNIVERSITE);
        return chercheurExterne;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ChercheurExterne createUpdatedEntity(EntityManager em) {
        ChercheurExterne chercheurExterne = new ChercheurExterne()
            .nom(UPDATED_NOM)
            .prenom(UPDATED_PRENOM)
            .email(UPDATED_EMAIL)
            .pays(UPDATED_PAYS)
            .universite(UPDATED_UNIVERSITE);
        return chercheurExterne;
    }

    @BeforeEach
    public void initTest() {
        chercheurExterne = createEntity(em);
    }

    @Test
    @Transactional
    void createChercheurExterne() throws Exception {
        int databaseSizeBeforeCreate = chercheurExterneRepository.findAll().size();
        // Create the ChercheurExterne
        restChercheurExterneMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(chercheurExterne))
            )
            .andExpect(status().isCreated());

        // Validate the ChercheurExterne in the database
        List<ChercheurExterne> chercheurExterneList = chercheurExterneRepository.findAll();
        assertThat(chercheurExterneList).hasSize(databaseSizeBeforeCreate + 1);
        ChercheurExterne testChercheurExterne = chercheurExterneList.get(chercheurExterneList.size() - 1);
        assertThat(testChercheurExterne.getNom()).isEqualTo(DEFAULT_NOM);
        assertThat(testChercheurExterne.getPrenom()).isEqualTo(DEFAULT_PRENOM);
        assertThat(testChercheurExterne.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testChercheurExterne.getPays()).isEqualTo(DEFAULT_PAYS);
        assertThat(testChercheurExterne.getUniversite()).isEqualTo(DEFAULT_UNIVERSITE);
    }

    @Test
    @Transactional
    void createChercheurExterneWithExistingId() throws Exception {
        // Create the ChercheurExterne with an existing ID
        chercheurExterne.setId(1L);

        int databaseSizeBeforeCreate = chercheurExterneRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restChercheurExterneMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(chercheurExterne))
            )
            .andExpect(status().isBadRequest());

        // Validate the ChercheurExterne in the database
        List<ChercheurExterne> chercheurExterneList = chercheurExterneRepository.findAll();
        assertThat(chercheurExterneList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllChercheurExternes() throws Exception {
        // Initialize the database
        chercheurExterneRepository.saveAndFlush(chercheurExterne);

        // Get all the chercheurExterneList
        restChercheurExterneMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(chercheurExterne.getId().intValue())))
            .andExpect(jsonPath("$.[*].nom").value(hasItem(DEFAULT_NOM)))
            .andExpect(jsonPath("$.[*].prenom").value(hasItem(DEFAULT_PRENOM)))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL)))
            .andExpect(jsonPath("$.[*].pays").value(hasItem(DEFAULT_PAYS)))
            .andExpect(jsonPath("$.[*].universite").value(hasItem(DEFAULT_UNIVERSITE)));
    }

    @Test
    @Transactional
    void getChercheurExterne() throws Exception {
        // Initialize the database
        chercheurExterneRepository.saveAndFlush(chercheurExterne);

        // Get the chercheurExterne
        restChercheurExterneMockMvc
            .perform(get(ENTITY_API_URL_ID, chercheurExterne.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(chercheurExterne.getId().intValue()))
            .andExpect(jsonPath("$.nom").value(DEFAULT_NOM))
            .andExpect(jsonPath("$.prenom").value(DEFAULT_PRENOM))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL))
            .andExpect(jsonPath("$.pays").value(DEFAULT_PAYS))
            .andExpect(jsonPath("$.universite").value(DEFAULT_UNIVERSITE));
    }

    @Test
    @Transactional
    void getNonExistingChercheurExterne() throws Exception {
        // Get the chercheurExterne
        restChercheurExterneMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewChercheurExterne() throws Exception {
        // Initialize the database
        chercheurExterneRepository.saveAndFlush(chercheurExterne);

        int databaseSizeBeforeUpdate = chercheurExterneRepository.findAll().size();

        // Update the chercheurExterne
        ChercheurExterne updatedChercheurExterne = chercheurExterneRepository.findById(chercheurExterne.getId()).get();
        // Disconnect from session so that the updates on updatedChercheurExterne are not directly saved in db
        em.detach(updatedChercheurExterne);
        updatedChercheurExterne
            .nom(UPDATED_NOM)
            .prenom(UPDATED_PRENOM)
            .email(UPDATED_EMAIL)
            .pays(UPDATED_PAYS)
            .universite(UPDATED_UNIVERSITE);

        restChercheurExterneMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedChercheurExterne.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedChercheurExterne))
            )
            .andExpect(status().isOk());

        // Validate the ChercheurExterne in the database
        List<ChercheurExterne> chercheurExterneList = chercheurExterneRepository.findAll();
        assertThat(chercheurExterneList).hasSize(databaseSizeBeforeUpdate);
        ChercheurExterne testChercheurExterne = chercheurExterneList.get(chercheurExterneList.size() - 1);
        assertThat(testChercheurExterne.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testChercheurExterne.getPrenom()).isEqualTo(UPDATED_PRENOM);
        assertThat(testChercheurExterne.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testChercheurExterne.getPays()).isEqualTo(UPDATED_PAYS);
        assertThat(testChercheurExterne.getUniversite()).isEqualTo(UPDATED_UNIVERSITE);
    }

    @Test
    @Transactional
    void putNonExistingChercheurExterne() throws Exception {
        int databaseSizeBeforeUpdate = chercheurExterneRepository.findAll().size();
        chercheurExterne.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restChercheurExterneMockMvc
            .perform(
                put(ENTITY_API_URL_ID, chercheurExterne.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(chercheurExterne))
            )
            .andExpect(status().isBadRequest());

        // Validate the ChercheurExterne in the database
        List<ChercheurExterne> chercheurExterneList = chercheurExterneRepository.findAll();
        assertThat(chercheurExterneList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchChercheurExterne() throws Exception {
        int databaseSizeBeforeUpdate = chercheurExterneRepository.findAll().size();
        chercheurExterne.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChercheurExterneMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(chercheurExterne))
            )
            .andExpect(status().isBadRequest());

        // Validate the ChercheurExterne in the database
        List<ChercheurExterne> chercheurExterneList = chercheurExterneRepository.findAll();
        assertThat(chercheurExterneList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamChercheurExterne() throws Exception {
        int databaseSizeBeforeUpdate = chercheurExterneRepository.findAll().size();
        chercheurExterne.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChercheurExterneMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(chercheurExterne))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ChercheurExterne in the database
        List<ChercheurExterne> chercheurExterneList = chercheurExterneRepository.findAll();
        assertThat(chercheurExterneList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateChercheurExterneWithPatch() throws Exception {
        // Initialize the database
        chercheurExterneRepository.saveAndFlush(chercheurExterne);

        int databaseSizeBeforeUpdate = chercheurExterneRepository.findAll().size();

        // Update the chercheurExterne using partial update
        ChercheurExterne partialUpdatedChercheurExterne = new ChercheurExterne();
        partialUpdatedChercheurExterne.setId(chercheurExterne.getId());

        partialUpdatedChercheurExterne.email(UPDATED_EMAIL);

        restChercheurExterneMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedChercheurExterne.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedChercheurExterne))
            )
            .andExpect(status().isOk());

        // Validate the ChercheurExterne in the database
        List<ChercheurExterne> chercheurExterneList = chercheurExterneRepository.findAll();
        assertThat(chercheurExterneList).hasSize(databaseSizeBeforeUpdate);
        ChercheurExterne testChercheurExterne = chercheurExterneList.get(chercheurExterneList.size() - 1);
        assertThat(testChercheurExterne.getNom()).isEqualTo(DEFAULT_NOM);
        assertThat(testChercheurExterne.getPrenom()).isEqualTo(DEFAULT_PRENOM);
        assertThat(testChercheurExterne.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testChercheurExterne.getPays()).isEqualTo(DEFAULT_PAYS);
        assertThat(testChercheurExterne.getUniversite()).isEqualTo(DEFAULT_UNIVERSITE);
    }

    @Test
    @Transactional
    void fullUpdateChercheurExterneWithPatch() throws Exception {
        // Initialize the database
        chercheurExterneRepository.saveAndFlush(chercheurExterne);

        int databaseSizeBeforeUpdate = chercheurExterneRepository.findAll().size();

        // Update the chercheurExterne using partial update
        ChercheurExterne partialUpdatedChercheurExterne = new ChercheurExterne();
        partialUpdatedChercheurExterne.setId(chercheurExterne.getId());

        partialUpdatedChercheurExterne
            .nom(UPDATED_NOM)
            .prenom(UPDATED_PRENOM)
            .email(UPDATED_EMAIL)
            .pays(UPDATED_PAYS)
            .universite(UPDATED_UNIVERSITE);

        restChercheurExterneMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedChercheurExterne.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedChercheurExterne))
            )
            .andExpect(status().isOk());

        // Validate the ChercheurExterne in the database
        List<ChercheurExterne> chercheurExterneList = chercheurExterneRepository.findAll();
        assertThat(chercheurExterneList).hasSize(databaseSizeBeforeUpdate);
        ChercheurExterne testChercheurExterne = chercheurExterneList.get(chercheurExterneList.size() - 1);
        assertThat(testChercheurExterne.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testChercheurExterne.getPrenom()).isEqualTo(UPDATED_PRENOM);
        assertThat(testChercheurExterne.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testChercheurExterne.getPays()).isEqualTo(UPDATED_PAYS);
        assertThat(testChercheurExterne.getUniversite()).isEqualTo(UPDATED_UNIVERSITE);
    }

    @Test
    @Transactional
    void patchNonExistingChercheurExterne() throws Exception {
        int databaseSizeBeforeUpdate = chercheurExterneRepository.findAll().size();
        chercheurExterne.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restChercheurExterneMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, chercheurExterne.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(chercheurExterne))
            )
            .andExpect(status().isBadRequest());

        // Validate the ChercheurExterne in the database
        List<ChercheurExterne> chercheurExterneList = chercheurExterneRepository.findAll();
        assertThat(chercheurExterneList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchChercheurExterne() throws Exception {
        int databaseSizeBeforeUpdate = chercheurExterneRepository.findAll().size();
        chercheurExterne.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChercheurExterneMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(chercheurExterne))
            )
            .andExpect(status().isBadRequest());

        // Validate the ChercheurExterne in the database
        List<ChercheurExterne> chercheurExterneList = chercheurExterneRepository.findAll();
        assertThat(chercheurExterneList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamChercheurExterne() throws Exception {
        int databaseSizeBeforeUpdate = chercheurExterneRepository.findAll().size();
        chercheurExterne.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChercheurExterneMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(chercheurExterne))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ChercheurExterne in the database
        List<ChercheurExterne> chercheurExterneList = chercheurExterneRepository.findAll();
        assertThat(chercheurExterneList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteChercheurExterne() throws Exception {
        // Initialize the database
        chercheurExterneRepository.saveAndFlush(chercheurExterne);

        int databaseSizeBeforeDelete = chercheurExterneRepository.findAll().size();

        // Delete the chercheurExterne
        restChercheurExterneMockMvc
            .perform(delete(ENTITY_API_URL_ID, chercheurExterne.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ChercheurExterne> chercheurExterneList = chercheurExterneRepository.findAll();
        assertThat(chercheurExterneList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
