package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Bac;
import com.mycompany.myapp.repository.BacRepository;
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
 * Integration tests for the {@link BacResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class BacResourceIT {

    private static final String DEFAULT_SERIE_BAC = "AAAAAAAAAA";
    private static final String UPDATED_SERIE_BAC = "BBBBBBBBBB";

    private static final String DEFAULT_TYPE_BAC = "AAAAAAAAAA";
    private static final String UPDATED_TYPE_BAC = "BBBBBBBBBB";

    private static final String DEFAULT_ANNEE_OBTENTION = "AAAAAAAAAA";
    private static final String UPDATED_ANNEE_OBTENTION = "BBBBBBBBBB";

    private static final Float DEFAULT_NOTE_BAC = 1F;
    private static final Float UPDATED_NOTE_BAC = 2F;

    private static final byte[] DEFAULT_SCANNE_BAC = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_SCANNE_BAC = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_SCANNE_BAC_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_SCANNE_BAC_CONTENT_TYPE = "image/png";

    private static final String DEFAULT_MENTION = "AAAAAAAAAA";
    private static final String UPDATED_MENTION = "BBBBBBBBBB";

    private static final String DEFAULT_VILLE_OBTENTION = "AAAAAAAAAA";
    private static final String UPDATED_VILLE_OBTENTION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/bacs";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private BacRepository bacRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restBacMockMvc;

    private Bac bac;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Bac createEntity(EntityManager em) {
        Bac bac = new Bac()
            .serieBac(DEFAULT_SERIE_BAC)
            .typeBac(DEFAULT_TYPE_BAC)
            .anneeObtention(DEFAULT_ANNEE_OBTENTION)
            .noteBac(DEFAULT_NOTE_BAC)
            .scanneBac(DEFAULT_SCANNE_BAC)
            .scanneBacContentType(DEFAULT_SCANNE_BAC_CONTENT_TYPE)
            .mention(DEFAULT_MENTION)
            .villeObtention(DEFAULT_VILLE_OBTENTION);
        return bac;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Bac createUpdatedEntity(EntityManager em) {
        Bac bac = new Bac()
            .serieBac(UPDATED_SERIE_BAC)
            .typeBac(UPDATED_TYPE_BAC)
            .anneeObtention(UPDATED_ANNEE_OBTENTION)
            .noteBac(UPDATED_NOTE_BAC)
            .scanneBac(UPDATED_SCANNE_BAC)
            .scanneBacContentType(UPDATED_SCANNE_BAC_CONTENT_TYPE)
            .mention(UPDATED_MENTION)
            .villeObtention(UPDATED_VILLE_OBTENTION);
        return bac;
    }

    @BeforeEach
    public void initTest() {
        bac = createEntity(em);
    }

    @Test
    @Transactional
    void createBac() throws Exception {
        int databaseSizeBeforeCreate = bacRepository.findAll().size();
        // Create the Bac
        restBacMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(bac))
            )
            .andExpect(status().isCreated());

        // Validate the Bac in the database
        List<Bac> bacList = bacRepository.findAll();
        assertThat(bacList).hasSize(databaseSizeBeforeCreate + 1);
        Bac testBac = bacList.get(bacList.size() - 1);
        assertThat(testBac.getSerieBac()).isEqualTo(DEFAULT_SERIE_BAC);
        assertThat(testBac.getTypeBac()).isEqualTo(DEFAULT_TYPE_BAC);
        assertThat(testBac.getAnneeObtention()).isEqualTo(DEFAULT_ANNEE_OBTENTION);
        assertThat(testBac.getNoteBac()).isEqualTo(DEFAULT_NOTE_BAC);
        assertThat(testBac.getScanneBac()).isEqualTo(DEFAULT_SCANNE_BAC);
        assertThat(testBac.getScanneBacContentType()).isEqualTo(DEFAULT_SCANNE_BAC_CONTENT_TYPE);
        assertThat(testBac.getMention()).isEqualTo(DEFAULT_MENTION);
        assertThat(testBac.getVilleObtention()).isEqualTo(DEFAULT_VILLE_OBTENTION);
    }

    @Test
    @Transactional
    void createBacWithExistingId() throws Exception {
        // Create the Bac with an existing ID
        bac.setId(1L);

        int databaseSizeBeforeCreate = bacRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restBacMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(bac))
            )
            .andExpect(status().isBadRequest());

        // Validate the Bac in the database
        List<Bac> bacList = bacRepository.findAll();
        assertThat(bacList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllBacs() throws Exception {
        // Initialize the database
        bacRepository.saveAndFlush(bac);

        // Get all the bacList
        restBacMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(bac.getId().intValue())))
            .andExpect(jsonPath("$.[*].serieBac").value(hasItem(DEFAULT_SERIE_BAC)))
            .andExpect(jsonPath("$.[*].typeBac").value(hasItem(DEFAULT_TYPE_BAC)))
            .andExpect(jsonPath("$.[*].anneeObtention").value(hasItem(DEFAULT_ANNEE_OBTENTION)))
            .andExpect(jsonPath("$.[*].noteBac").value(hasItem(DEFAULT_NOTE_BAC.doubleValue())))
            .andExpect(jsonPath("$.[*].scanneBacContentType").value(hasItem(DEFAULT_SCANNE_BAC_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].scanneBac").value(hasItem(Base64Utils.encodeToString(DEFAULT_SCANNE_BAC))))
            .andExpect(jsonPath("$.[*].mention").value(hasItem(DEFAULT_MENTION)))
            .andExpect(jsonPath("$.[*].villeObtention").value(hasItem(DEFAULT_VILLE_OBTENTION)));
    }

    @Test
    @Transactional
    void getBac() throws Exception {
        // Initialize the database
        bacRepository.saveAndFlush(bac);

        // Get the bac
        restBacMockMvc
            .perform(get(ENTITY_API_URL_ID, bac.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(bac.getId().intValue()))
            .andExpect(jsonPath("$.serieBac").value(DEFAULT_SERIE_BAC))
            .andExpect(jsonPath("$.typeBac").value(DEFAULT_TYPE_BAC))
            .andExpect(jsonPath("$.anneeObtention").value(DEFAULT_ANNEE_OBTENTION))
            .andExpect(jsonPath("$.noteBac").value(DEFAULT_NOTE_BAC.doubleValue()))
            .andExpect(jsonPath("$.scanneBacContentType").value(DEFAULT_SCANNE_BAC_CONTENT_TYPE))
            .andExpect(jsonPath("$.scanneBac").value(Base64Utils.encodeToString(DEFAULT_SCANNE_BAC)))
            .andExpect(jsonPath("$.mention").value(DEFAULT_MENTION))
            .andExpect(jsonPath("$.villeObtention").value(DEFAULT_VILLE_OBTENTION));
    }

    @Test
    @Transactional
    void getNonExistingBac() throws Exception {
        // Get the bac
        restBacMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewBac() throws Exception {
        // Initialize the database
        bacRepository.saveAndFlush(bac);

        int databaseSizeBeforeUpdate = bacRepository.findAll().size();

        // Update the bac
        Bac updatedBac = bacRepository.findById(bac.getId()).get();
        // Disconnect from session so that the updates on updatedBac are not directly saved in db
        em.detach(updatedBac);
        updatedBac
            .serieBac(UPDATED_SERIE_BAC)
            .typeBac(UPDATED_TYPE_BAC)
            .anneeObtention(UPDATED_ANNEE_OBTENTION)
            .noteBac(UPDATED_NOTE_BAC)
            .scanneBac(UPDATED_SCANNE_BAC)
            .scanneBacContentType(UPDATED_SCANNE_BAC_CONTENT_TYPE)
            .mention(UPDATED_MENTION)
            .villeObtention(UPDATED_VILLE_OBTENTION);

        restBacMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedBac.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedBac))
            )
            .andExpect(status().isOk());

        // Validate the Bac in the database
        List<Bac> bacList = bacRepository.findAll();
        assertThat(bacList).hasSize(databaseSizeBeforeUpdate);
        Bac testBac = bacList.get(bacList.size() - 1);
        assertThat(testBac.getSerieBac()).isEqualTo(UPDATED_SERIE_BAC);
        assertThat(testBac.getTypeBac()).isEqualTo(UPDATED_TYPE_BAC);
        assertThat(testBac.getAnneeObtention()).isEqualTo(UPDATED_ANNEE_OBTENTION);
        assertThat(testBac.getNoteBac()).isEqualTo(UPDATED_NOTE_BAC);
        assertThat(testBac.getScanneBac()).isEqualTo(UPDATED_SCANNE_BAC);
        assertThat(testBac.getScanneBacContentType()).isEqualTo(UPDATED_SCANNE_BAC_CONTENT_TYPE);
        assertThat(testBac.getMention()).isEqualTo(UPDATED_MENTION);
        assertThat(testBac.getVilleObtention()).isEqualTo(UPDATED_VILLE_OBTENTION);
    }

    @Test
    @Transactional
    void putNonExistingBac() throws Exception {
        int databaseSizeBeforeUpdate = bacRepository.findAll().size();
        bac.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBacMockMvc
            .perform(
                put(ENTITY_API_URL_ID, bac.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(bac))
            )
            .andExpect(status().isBadRequest());

        // Validate the Bac in the database
        List<Bac> bacList = bacRepository.findAll();
        assertThat(bacList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchBac() throws Exception {
        int databaseSizeBeforeUpdate = bacRepository.findAll().size();
        bac.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBacMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(bac))
            )
            .andExpect(status().isBadRequest());

        // Validate the Bac in the database
        List<Bac> bacList = bacRepository.findAll();
        assertThat(bacList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamBac() throws Exception {
        int databaseSizeBeforeUpdate = bacRepository.findAll().size();
        bac.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBacMockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(bac))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Bac in the database
        List<Bac> bacList = bacRepository.findAll();
        assertThat(bacList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateBacWithPatch() throws Exception {
        // Initialize the database
        bacRepository.saveAndFlush(bac);

        int databaseSizeBeforeUpdate = bacRepository.findAll().size();

        // Update the bac using partial update
        Bac partialUpdatedBac = new Bac();
        partialUpdatedBac.setId(bac.getId());

        partialUpdatedBac
            .serieBac(UPDATED_SERIE_BAC)
            .noteBac(UPDATED_NOTE_BAC)
            .scanneBac(UPDATED_SCANNE_BAC)
            .scanneBacContentType(UPDATED_SCANNE_BAC_CONTENT_TYPE)
            .villeObtention(UPDATED_VILLE_OBTENTION);

        restBacMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBac.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBac))
            )
            .andExpect(status().isOk());

        // Validate the Bac in the database
        List<Bac> bacList = bacRepository.findAll();
        assertThat(bacList).hasSize(databaseSizeBeforeUpdate);
        Bac testBac = bacList.get(bacList.size() - 1);
        assertThat(testBac.getSerieBac()).isEqualTo(UPDATED_SERIE_BAC);
        assertThat(testBac.getTypeBac()).isEqualTo(DEFAULT_TYPE_BAC);
        assertThat(testBac.getAnneeObtention()).isEqualTo(DEFAULT_ANNEE_OBTENTION);
        assertThat(testBac.getNoteBac()).isEqualTo(UPDATED_NOTE_BAC);
        assertThat(testBac.getScanneBac()).isEqualTo(UPDATED_SCANNE_BAC);
        assertThat(testBac.getScanneBacContentType()).isEqualTo(UPDATED_SCANNE_BAC_CONTENT_TYPE);
        assertThat(testBac.getMention()).isEqualTo(DEFAULT_MENTION);
        assertThat(testBac.getVilleObtention()).isEqualTo(UPDATED_VILLE_OBTENTION);
    }

    @Test
    @Transactional
    void fullUpdateBacWithPatch() throws Exception {
        // Initialize the database
        bacRepository.saveAndFlush(bac);

        int databaseSizeBeforeUpdate = bacRepository.findAll().size();

        // Update the bac using partial update
        Bac partialUpdatedBac = new Bac();
        partialUpdatedBac.setId(bac.getId());

        partialUpdatedBac
            .serieBac(UPDATED_SERIE_BAC)
            .typeBac(UPDATED_TYPE_BAC)
            .anneeObtention(UPDATED_ANNEE_OBTENTION)
            .noteBac(UPDATED_NOTE_BAC)
            .scanneBac(UPDATED_SCANNE_BAC)
            .scanneBacContentType(UPDATED_SCANNE_BAC_CONTENT_TYPE)
            .mention(UPDATED_MENTION)
            .villeObtention(UPDATED_VILLE_OBTENTION);

        restBacMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBac.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBac))
            )
            .andExpect(status().isOk());

        // Validate the Bac in the database
        List<Bac> bacList = bacRepository.findAll();
        assertThat(bacList).hasSize(databaseSizeBeforeUpdate);
        Bac testBac = bacList.get(bacList.size() - 1);
        assertThat(testBac.getSerieBac()).isEqualTo(UPDATED_SERIE_BAC);
        assertThat(testBac.getTypeBac()).isEqualTo(UPDATED_TYPE_BAC);
        assertThat(testBac.getAnneeObtention()).isEqualTo(UPDATED_ANNEE_OBTENTION);
        assertThat(testBac.getNoteBac()).isEqualTo(UPDATED_NOTE_BAC);
        assertThat(testBac.getScanneBac()).isEqualTo(UPDATED_SCANNE_BAC);
        assertThat(testBac.getScanneBacContentType()).isEqualTo(UPDATED_SCANNE_BAC_CONTENT_TYPE);
        assertThat(testBac.getMention()).isEqualTo(UPDATED_MENTION);
        assertThat(testBac.getVilleObtention()).isEqualTo(UPDATED_VILLE_OBTENTION);
    }

    @Test
    @Transactional
    void patchNonExistingBac() throws Exception {
        int databaseSizeBeforeUpdate = bacRepository.findAll().size();
        bac.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBacMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, bac.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(bac))
            )
            .andExpect(status().isBadRequest());

        // Validate the Bac in the database
        List<Bac> bacList = bacRepository.findAll();
        assertThat(bacList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchBac() throws Exception {
        int databaseSizeBeforeUpdate = bacRepository.findAll().size();
        bac.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBacMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(bac))
            )
            .andExpect(status().isBadRequest());

        // Validate the Bac in the database
        List<Bac> bacList = bacRepository.findAll();
        assertThat(bacList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamBac() throws Exception {
        int databaseSizeBeforeUpdate = bacRepository.findAll().size();
        bac.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBacMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(bac))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Bac in the database
        List<Bac> bacList = bacRepository.findAll();
        assertThat(bacList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteBac() throws Exception {
        // Initialize the database
        bacRepository.saveAndFlush(bac);

        int databaseSizeBeforeDelete = bacRepository.findAll().size();

        // Delete the bac
        restBacMockMvc
            .perform(delete(ENTITY_API_URL_ID, bac.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Bac> bacList = bacRepository.findAll();
        assertThat(bacList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
