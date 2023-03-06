package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.FormationDoctorant;
import com.mycompany.myapp.repository.FormationDoctorantRepository;
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
 * Integration tests for the {@link FormationDoctorantResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class FormationDoctorantResourceIT {

    private static final String DEFAULT_SPECIALITE = "AAAAAAAAAA";
    private static final String UPDATED_SPECIALITE = "BBBBBBBBBB";

    private static final String DEFAULT_TYPE = "AAAAAAAAAA";
    private static final String UPDATED_TYPE = "BBBBBBBBBB";

    private static final String DEFAULT_DATE_OBTENTION = "AAAAAAAAAA";
    private static final String UPDATED_DATE_OBTENTION = "BBBBBBBBBB";

    private static final Float DEFAULT_NOTE_1 = 1F;
    private static final Float UPDATED_NOTE_1 = 2F;

    private static final byte[] DEFAULT_SCANNE_NOTE_1 = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_SCANNE_NOTE_1 = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_SCANNE_NOTE_1_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_SCANNE_NOTE_1_CONTENT_TYPE = "image/png";

    private static final Float DEFAULT_NOTE_2 = 1F;
    private static final Float UPDATED_NOTE_2 = 2F;

    private static final byte[] DEFAULT_SCANNE_NOTE_2 = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_SCANNE_NOTE_2 = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_SCANNE_NOTE_2_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_SCANNE_NOTE_2_CONTENT_TYPE = "image/png";

    private static final Float DEFAULT_NOTE_3 = 1F;
    private static final Float UPDATED_NOTE_3 = 2F;

    private static final byte[] DEFAULT_SCANNE_NOTE_3 = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_SCANNE_NOTE_3 = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_SCANNE_NOTE_3_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_SCANNE_NOTE_3_CONTENT_TYPE = "image/png";

    private static final Float DEFAULT_NOTE_4 = 1F;
    private static final Float UPDATED_NOTE_4 = 2F;

    private static final byte[] DEFAULT_SCANNE_NOTE_4 = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_SCANNE_NOTE_4 = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_SCANNE_NOTE_4_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_SCANNE_NOTE_4_CONTENT_TYPE = "image/png";

    private static final Float DEFAULT_NOTE_5 = 1F;
    private static final Float UPDATED_NOTE_5 = 2F;

    private static final byte[] DEFAULT_SCANNE_NOTE_5 = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_SCANNE_NOTE_5 = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_SCANNE_NOTE_5_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_SCANNE_NOTE_5_CONTENT_TYPE = "image/png";

    private static final byte[] DEFAULT_SCANNE_DIPLOME = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_SCANNE_DIPLOME = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_SCANNE_DIPLOME_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_SCANNE_DIPLOME_CONTENT_TYPE = "image/png";

    private static final String DEFAULT_MENTION = "AAAAAAAAAA";
    private static final String UPDATED_MENTION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/formation-doctorants";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private FormationDoctorantRepository formationDoctorantRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restFormationDoctorantMockMvc;

    private FormationDoctorant formationDoctorant;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static FormationDoctorant createEntity(EntityManager em) {
        FormationDoctorant formationDoctorant = new FormationDoctorant()
            .specialite(DEFAULT_SPECIALITE)
            .type(DEFAULT_TYPE)
            .dateObtention(DEFAULT_DATE_OBTENTION)
            .note1(DEFAULT_NOTE_1)
            .scanneNote1(DEFAULT_SCANNE_NOTE_1)
            .scanneNote1ContentType(DEFAULT_SCANNE_NOTE_1_CONTENT_TYPE)
            .note2(DEFAULT_NOTE_2)
            .scanneNote2(DEFAULT_SCANNE_NOTE_2)
            .scanneNote2ContentType(DEFAULT_SCANNE_NOTE_2_CONTENT_TYPE)
            .note3(DEFAULT_NOTE_3)
            .scanneNote3(DEFAULT_SCANNE_NOTE_3)
            .scanneNote3ContentType(DEFAULT_SCANNE_NOTE_3_CONTENT_TYPE)
            .note4(DEFAULT_NOTE_4)
            .scanneNote4(DEFAULT_SCANNE_NOTE_4)
            .scanneNote4ContentType(DEFAULT_SCANNE_NOTE_4_CONTENT_TYPE)
            .note5(DEFAULT_NOTE_5)
            .scanneNote5(DEFAULT_SCANNE_NOTE_5)
            .scanneNote5ContentType(DEFAULT_SCANNE_NOTE_5_CONTENT_TYPE)
            .scanneDiplome(DEFAULT_SCANNE_DIPLOME)
            .scanneDiplomeContentType(DEFAULT_SCANNE_DIPLOME_CONTENT_TYPE)
            .mention(DEFAULT_MENTION);
        return formationDoctorant;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static FormationDoctorant createUpdatedEntity(EntityManager em) {
        FormationDoctorant formationDoctorant = new FormationDoctorant()
            .specialite(UPDATED_SPECIALITE)
            .type(UPDATED_TYPE)
            .dateObtention(UPDATED_DATE_OBTENTION)
            .note1(UPDATED_NOTE_1)
            .scanneNote1(UPDATED_SCANNE_NOTE_1)
            .scanneNote1ContentType(UPDATED_SCANNE_NOTE_1_CONTENT_TYPE)
            .note2(UPDATED_NOTE_2)
            .scanneNote2(UPDATED_SCANNE_NOTE_2)
            .scanneNote2ContentType(UPDATED_SCANNE_NOTE_2_CONTENT_TYPE)
            .note3(UPDATED_NOTE_3)
            .scanneNote3(UPDATED_SCANNE_NOTE_3)
            .scanneNote3ContentType(UPDATED_SCANNE_NOTE_3_CONTENT_TYPE)
            .note4(UPDATED_NOTE_4)
            .scanneNote4(UPDATED_SCANNE_NOTE_4)
            .scanneNote4ContentType(UPDATED_SCANNE_NOTE_4_CONTENT_TYPE)
            .note5(UPDATED_NOTE_5)
            .scanneNote5(UPDATED_SCANNE_NOTE_5)
            .scanneNote5ContentType(UPDATED_SCANNE_NOTE_5_CONTENT_TYPE)
            .scanneDiplome(UPDATED_SCANNE_DIPLOME)
            .scanneDiplomeContentType(UPDATED_SCANNE_DIPLOME_CONTENT_TYPE)
            .mention(UPDATED_MENTION);
        return formationDoctorant;
    }

    @BeforeEach
    public void initTest() {
        formationDoctorant = createEntity(em);
    }

    @Test
    @Transactional
    void createFormationDoctorant() throws Exception {
        int databaseSizeBeforeCreate = formationDoctorantRepository.findAll().size();
        // Create the FormationDoctorant
        restFormationDoctorantMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(formationDoctorant))
            )
            .andExpect(status().isCreated());

        // Validate the FormationDoctorant in the database
        List<FormationDoctorant> formationDoctorantList = formationDoctorantRepository.findAll();
        assertThat(formationDoctorantList).hasSize(databaseSizeBeforeCreate + 1);
        FormationDoctorant testFormationDoctorant = formationDoctorantList.get(formationDoctorantList.size() - 1);
        assertThat(testFormationDoctorant.getSpecialite()).isEqualTo(DEFAULT_SPECIALITE);
        assertThat(testFormationDoctorant.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testFormationDoctorant.getDateObtention()).isEqualTo(DEFAULT_DATE_OBTENTION);
        assertThat(testFormationDoctorant.getNote1()).isEqualTo(DEFAULT_NOTE_1);
        assertThat(testFormationDoctorant.getScanneNote1()).isEqualTo(DEFAULT_SCANNE_NOTE_1);
        assertThat(testFormationDoctorant.getScanneNote1ContentType()).isEqualTo(DEFAULT_SCANNE_NOTE_1_CONTENT_TYPE);
        assertThat(testFormationDoctorant.getNote2()).isEqualTo(DEFAULT_NOTE_2);
        assertThat(testFormationDoctorant.getScanneNote2()).isEqualTo(DEFAULT_SCANNE_NOTE_2);
        assertThat(testFormationDoctorant.getScanneNote2ContentType()).isEqualTo(DEFAULT_SCANNE_NOTE_2_CONTENT_TYPE);
        assertThat(testFormationDoctorant.getNote3()).isEqualTo(DEFAULT_NOTE_3);
        assertThat(testFormationDoctorant.getScanneNote3()).isEqualTo(DEFAULT_SCANNE_NOTE_3);
        assertThat(testFormationDoctorant.getScanneNote3ContentType()).isEqualTo(DEFAULT_SCANNE_NOTE_3_CONTENT_TYPE);
        assertThat(testFormationDoctorant.getNote4()).isEqualTo(DEFAULT_NOTE_4);
        assertThat(testFormationDoctorant.getScanneNote4()).isEqualTo(DEFAULT_SCANNE_NOTE_4);
        assertThat(testFormationDoctorant.getScanneNote4ContentType()).isEqualTo(DEFAULT_SCANNE_NOTE_4_CONTENT_TYPE);
        assertThat(testFormationDoctorant.getNote5()).isEqualTo(DEFAULT_NOTE_5);
        assertThat(testFormationDoctorant.getScanneNote5()).isEqualTo(DEFAULT_SCANNE_NOTE_5);
        assertThat(testFormationDoctorant.getScanneNote5ContentType()).isEqualTo(DEFAULT_SCANNE_NOTE_5_CONTENT_TYPE);
        assertThat(testFormationDoctorant.getScanneDiplome()).isEqualTo(DEFAULT_SCANNE_DIPLOME);
        assertThat(testFormationDoctorant.getScanneDiplomeContentType()).isEqualTo(DEFAULT_SCANNE_DIPLOME_CONTENT_TYPE);
        assertThat(testFormationDoctorant.getMention()).isEqualTo(DEFAULT_MENTION);
    }

    @Test
    @Transactional
    void createFormationDoctorantWithExistingId() throws Exception {
        // Create the FormationDoctorant with an existing ID
        formationDoctorant.setId(1L);

        int databaseSizeBeforeCreate = formationDoctorantRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restFormationDoctorantMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(formationDoctorant))
            )
            .andExpect(status().isBadRequest());

        // Validate the FormationDoctorant in the database
        List<FormationDoctorant> formationDoctorantList = formationDoctorantRepository.findAll();
        assertThat(formationDoctorantList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllFormationDoctorants() throws Exception {
        // Initialize the database
        formationDoctorantRepository.saveAndFlush(formationDoctorant);

        // Get all the formationDoctorantList
        restFormationDoctorantMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(formationDoctorant.getId().intValue())))
            .andExpect(jsonPath("$.[*].specialite").value(hasItem(DEFAULT_SPECIALITE)))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE)))
            .andExpect(jsonPath("$.[*].dateObtention").value(hasItem(DEFAULT_DATE_OBTENTION)))
            .andExpect(jsonPath("$.[*].note1").value(hasItem(DEFAULT_NOTE_1.doubleValue())))
            .andExpect(jsonPath("$.[*].scanneNote1ContentType").value(hasItem(DEFAULT_SCANNE_NOTE_1_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].scanneNote1").value(hasItem(Base64Utils.encodeToString(DEFAULT_SCANNE_NOTE_1))))
            .andExpect(jsonPath("$.[*].note2").value(hasItem(DEFAULT_NOTE_2.doubleValue())))
            .andExpect(jsonPath("$.[*].scanneNote2ContentType").value(hasItem(DEFAULT_SCANNE_NOTE_2_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].scanneNote2").value(hasItem(Base64Utils.encodeToString(DEFAULT_SCANNE_NOTE_2))))
            .andExpect(jsonPath("$.[*].note3").value(hasItem(DEFAULT_NOTE_3.doubleValue())))
            .andExpect(jsonPath("$.[*].scanneNote3ContentType").value(hasItem(DEFAULT_SCANNE_NOTE_3_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].scanneNote3").value(hasItem(Base64Utils.encodeToString(DEFAULT_SCANNE_NOTE_3))))
            .andExpect(jsonPath("$.[*].note4").value(hasItem(DEFAULT_NOTE_4.doubleValue())))
            .andExpect(jsonPath("$.[*].scanneNote4ContentType").value(hasItem(DEFAULT_SCANNE_NOTE_4_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].scanneNote4").value(hasItem(Base64Utils.encodeToString(DEFAULT_SCANNE_NOTE_4))))
            .andExpect(jsonPath("$.[*].note5").value(hasItem(DEFAULT_NOTE_5.doubleValue())))
            .andExpect(jsonPath("$.[*].scanneNote5ContentType").value(hasItem(DEFAULT_SCANNE_NOTE_5_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].scanneNote5").value(hasItem(Base64Utils.encodeToString(DEFAULT_SCANNE_NOTE_5))))
            .andExpect(jsonPath("$.[*].scanneDiplomeContentType").value(hasItem(DEFAULT_SCANNE_DIPLOME_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].scanneDiplome").value(hasItem(Base64Utils.encodeToString(DEFAULT_SCANNE_DIPLOME))))
            .andExpect(jsonPath("$.[*].mention").value(hasItem(DEFAULT_MENTION)));
    }

    @Test
    @Transactional
    void getFormationDoctorant() throws Exception {
        // Initialize the database
        formationDoctorantRepository.saveAndFlush(formationDoctorant);

        // Get the formationDoctorant
        restFormationDoctorantMockMvc
            .perform(get(ENTITY_API_URL_ID, formationDoctorant.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(formationDoctorant.getId().intValue()))
            .andExpect(jsonPath("$.specialite").value(DEFAULT_SPECIALITE))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE))
            .andExpect(jsonPath("$.dateObtention").value(DEFAULT_DATE_OBTENTION))
            .andExpect(jsonPath("$.note1").value(DEFAULT_NOTE_1.doubleValue()))
            .andExpect(jsonPath("$.scanneNote1ContentType").value(DEFAULT_SCANNE_NOTE_1_CONTENT_TYPE))
            .andExpect(jsonPath("$.scanneNote1").value(Base64Utils.encodeToString(DEFAULT_SCANNE_NOTE_1)))
            .andExpect(jsonPath("$.note2").value(DEFAULT_NOTE_2.doubleValue()))
            .andExpect(jsonPath("$.scanneNote2ContentType").value(DEFAULT_SCANNE_NOTE_2_CONTENT_TYPE))
            .andExpect(jsonPath("$.scanneNote2").value(Base64Utils.encodeToString(DEFAULT_SCANNE_NOTE_2)))
            .andExpect(jsonPath("$.note3").value(DEFAULT_NOTE_3.doubleValue()))
            .andExpect(jsonPath("$.scanneNote3ContentType").value(DEFAULT_SCANNE_NOTE_3_CONTENT_TYPE))
            .andExpect(jsonPath("$.scanneNote3").value(Base64Utils.encodeToString(DEFAULT_SCANNE_NOTE_3)))
            .andExpect(jsonPath("$.note4").value(DEFAULT_NOTE_4.doubleValue()))
            .andExpect(jsonPath("$.scanneNote4ContentType").value(DEFAULT_SCANNE_NOTE_4_CONTENT_TYPE))
            .andExpect(jsonPath("$.scanneNote4").value(Base64Utils.encodeToString(DEFAULT_SCANNE_NOTE_4)))
            .andExpect(jsonPath("$.note5").value(DEFAULT_NOTE_5.doubleValue()))
            .andExpect(jsonPath("$.scanneNote5ContentType").value(DEFAULT_SCANNE_NOTE_5_CONTENT_TYPE))
            .andExpect(jsonPath("$.scanneNote5").value(Base64Utils.encodeToString(DEFAULT_SCANNE_NOTE_5)))
            .andExpect(jsonPath("$.scanneDiplomeContentType").value(DEFAULT_SCANNE_DIPLOME_CONTENT_TYPE))
            .andExpect(jsonPath("$.scanneDiplome").value(Base64Utils.encodeToString(DEFAULT_SCANNE_DIPLOME)))
            .andExpect(jsonPath("$.mention").value(DEFAULT_MENTION));
    }

    @Test
    @Transactional
    void getNonExistingFormationDoctorant() throws Exception {
        // Get the formationDoctorant
        restFormationDoctorantMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewFormationDoctorant() throws Exception {
        // Initialize the database
        formationDoctorantRepository.saveAndFlush(formationDoctorant);

        int databaseSizeBeforeUpdate = formationDoctorantRepository.findAll().size();

        // Update the formationDoctorant
        FormationDoctorant updatedFormationDoctorant = formationDoctorantRepository.findById(formationDoctorant.getId()).get();
        // Disconnect from session so that the updates on updatedFormationDoctorant are not directly saved in db
        em.detach(updatedFormationDoctorant);
        updatedFormationDoctorant
            .specialite(UPDATED_SPECIALITE)
            .type(UPDATED_TYPE)
            .dateObtention(UPDATED_DATE_OBTENTION)
            .note1(UPDATED_NOTE_1)
            .scanneNote1(UPDATED_SCANNE_NOTE_1)
            .scanneNote1ContentType(UPDATED_SCANNE_NOTE_1_CONTENT_TYPE)
            .note2(UPDATED_NOTE_2)
            .scanneNote2(UPDATED_SCANNE_NOTE_2)
            .scanneNote2ContentType(UPDATED_SCANNE_NOTE_2_CONTENT_TYPE)
            .note3(UPDATED_NOTE_3)
            .scanneNote3(UPDATED_SCANNE_NOTE_3)
            .scanneNote3ContentType(UPDATED_SCANNE_NOTE_3_CONTENT_TYPE)
            .note4(UPDATED_NOTE_4)
            .scanneNote4(UPDATED_SCANNE_NOTE_4)
            .scanneNote4ContentType(UPDATED_SCANNE_NOTE_4_CONTENT_TYPE)
            .note5(UPDATED_NOTE_5)
            .scanneNote5(UPDATED_SCANNE_NOTE_5)
            .scanneNote5ContentType(UPDATED_SCANNE_NOTE_5_CONTENT_TYPE)
            .scanneDiplome(UPDATED_SCANNE_DIPLOME)
            .scanneDiplomeContentType(UPDATED_SCANNE_DIPLOME_CONTENT_TYPE)
            .mention(UPDATED_MENTION);

        restFormationDoctorantMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedFormationDoctorant.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedFormationDoctorant))
            )
            .andExpect(status().isOk());

        // Validate the FormationDoctorant in the database
        List<FormationDoctorant> formationDoctorantList = formationDoctorantRepository.findAll();
        assertThat(formationDoctorantList).hasSize(databaseSizeBeforeUpdate);
        FormationDoctorant testFormationDoctorant = formationDoctorantList.get(formationDoctorantList.size() - 1);
        assertThat(testFormationDoctorant.getSpecialite()).isEqualTo(UPDATED_SPECIALITE);
        assertThat(testFormationDoctorant.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testFormationDoctorant.getDateObtention()).isEqualTo(UPDATED_DATE_OBTENTION);
        assertThat(testFormationDoctorant.getNote1()).isEqualTo(UPDATED_NOTE_1);
        assertThat(testFormationDoctorant.getScanneNote1()).isEqualTo(UPDATED_SCANNE_NOTE_1);
        assertThat(testFormationDoctorant.getScanneNote1ContentType()).isEqualTo(UPDATED_SCANNE_NOTE_1_CONTENT_TYPE);
        assertThat(testFormationDoctorant.getNote2()).isEqualTo(UPDATED_NOTE_2);
        assertThat(testFormationDoctorant.getScanneNote2()).isEqualTo(UPDATED_SCANNE_NOTE_2);
        assertThat(testFormationDoctorant.getScanneNote2ContentType()).isEqualTo(UPDATED_SCANNE_NOTE_2_CONTENT_TYPE);
        assertThat(testFormationDoctorant.getNote3()).isEqualTo(UPDATED_NOTE_3);
        assertThat(testFormationDoctorant.getScanneNote3()).isEqualTo(UPDATED_SCANNE_NOTE_3);
        assertThat(testFormationDoctorant.getScanneNote3ContentType()).isEqualTo(UPDATED_SCANNE_NOTE_3_CONTENT_TYPE);
        assertThat(testFormationDoctorant.getNote4()).isEqualTo(UPDATED_NOTE_4);
        assertThat(testFormationDoctorant.getScanneNote4()).isEqualTo(UPDATED_SCANNE_NOTE_4);
        assertThat(testFormationDoctorant.getScanneNote4ContentType()).isEqualTo(UPDATED_SCANNE_NOTE_4_CONTENT_TYPE);
        assertThat(testFormationDoctorant.getNote5()).isEqualTo(UPDATED_NOTE_5);
        assertThat(testFormationDoctorant.getScanneNote5()).isEqualTo(UPDATED_SCANNE_NOTE_5);
        assertThat(testFormationDoctorant.getScanneNote5ContentType()).isEqualTo(UPDATED_SCANNE_NOTE_5_CONTENT_TYPE);
        assertThat(testFormationDoctorant.getScanneDiplome()).isEqualTo(UPDATED_SCANNE_DIPLOME);
        assertThat(testFormationDoctorant.getScanneDiplomeContentType()).isEqualTo(UPDATED_SCANNE_DIPLOME_CONTENT_TYPE);
        assertThat(testFormationDoctorant.getMention()).isEqualTo(UPDATED_MENTION);
    }

    @Test
    @Transactional
    void putNonExistingFormationDoctorant() throws Exception {
        int databaseSizeBeforeUpdate = formationDoctorantRepository.findAll().size();
        formationDoctorant.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFormationDoctorantMockMvc
            .perform(
                put(ENTITY_API_URL_ID, formationDoctorant.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(formationDoctorant))
            )
            .andExpect(status().isBadRequest());

        // Validate the FormationDoctorant in the database
        List<FormationDoctorant> formationDoctorantList = formationDoctorantRepository.findAll();
        assertThat(formationDoctorantList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchFormationDoctorant() throws Exception {
        int databaseSizeBeforeUpdate = formationDoctorantRepository.findAll().size();
        formationDoctorant.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFormationDoctorantMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(formationDoctorant))
            )
            .andExpect(status().isBadRequest());

        // Validate the FormationDoctorant in the database
        List<FormationDoctorant> formationDoctorantList = formationDoctorantRepository.findAll();
        assertThat(formationDoctorantList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamFormationDoctorant() throws Exception {
        int databaseSizeBeforeUpdate = formationDoctorantRepository.findAll().size();
        formationDoctorant.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFormationDoctorantMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(formationDoctorant))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the FormationDoctorant in the database
        List<FormationDoctorant> formationDoctorantList = formationDoctorantRepository.findAll();
        assertThat(formationDoctorantList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateFormationDoctorantWithPatch() throws Exception {
        // Initialize the database
        formationDoctorantRepository.saveAndFlush(formationDoctorant);

        int databaseSizeBeforeUpdate = formationDoctorantRepository.findAll().size();

        // Update the formationDoctorant using partial update
        FormationDoctorant partialUpdatedFormationDoctorant = new FormationDoctorant();
        partialUpdatedFormationDoctorant.setId(formationDoctorant.getId());

        partialUpdatedFormationDoctorant
            .type(UPDATED_TYPE)
            .dateObtention(UPDATED_DATE_OBTENTION)
            .note1(UPDATED_NOTE_1)
            .scanneNote1(UPDATED_SCANNE_NOTE_1)
            .scanneNote1ContentType(UPDATED_SCANNE_NOTE_1_CONTENT_TYPE)
            .scanneNote3(UPDATED_SCANNE_NOTE_3)
            .scanneNote3ContentType(UPDATED_SCANNE_NOTE_3_CONTENT_TYPE)
            .note5(UPDATED_NOTE_5)
            .scanneDiplome(UPDATED_SCANNE_DIPLOME)
            .scanneDiplomeContentType(UPDATED_SCANNE_DIPLOME_CONTENT_TYPE);

        restFormationDoctorantMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFormationDoctorant.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFormationDoctorant))
            )
            .andExpect(status().isOk());

        // Validate the FormationDoctorant in the database
        List<FormationDoctorant> formationDoctorantList = formationDoctorantRepository.findAll();
        assertThat(formationDoctorantList).hasSize(databaseSizeBeforeUpdate);
        FormationDoctorant testFormationDoctorant = formationDoctorantList.get(formationDoctorantList.size() - 1);
        assertThat(testFormationDoctorant.getSpecialite()).isEqualTo(DEFAULT_SPECIALITE);
        assertThat(testFormationDoctorant.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testFormationDoctorant.getDateObtention()).isEqualTo(UPDATED_DATE_OBTENTION);
        assertThat(testFormationDoctorant.getNote1()).isEqualTo(UPDATED_NOTE_1);
        assertThat(testFormationDoctorant.getScanneNote1()).isEqualTo(UPDATED_SCANNE_NOTE_1);
        assertThat(testFormationDoctorant.getScanneNote1ContentType()).isEqualTo(UPDATED_SCANNE_NOTE_1_CONTENT_TYPE);
        assertThat(testFormationDoctorant.getNote2()).isEqualTo(DEFAULT_NOTE_2);
        assertThat(testFormationDoctorant.getScanneNote2()).isEqualTo(DEFAULT_SCANNE_NOTE_2);
        assertThat(testFormationDoctorant.getScanneNote2ContentType()).isEqualTo(DEFAULT_SCANNE_NOTE_2_CONTENT_TYPE);
        assertThat(testFormationDoctorant.getNote3()).isEqualTo(DEFAULT_NOTE_3);
        assertThat(testFormationDoctorant.getScanneNote3()).isEqualTo(UPDATED_SCANNE_NOTE_3);
        assertThat(testFormationDoctorant.getScanneNote3ContentType()).isEqualTo(UPDATED_SCANNE_NOTE_3_CONTENT_TYPE);
        assertThat(testFormationDoctorant.getNote4()).isEqualTo(DEFAULT_NOTE_4);
        assertThat(testFormationDoctorant.getScanneNote4()).isEqualTo(DEFAULT_SCANNE_NOTE_4);
        assertThat(testFormationDoctorant.getScanneNote4ContentType()).isEqualTo(DEFAULT_SCANNE_NOTE_4_CONTENT_TYPE);
        assertThat(testFormationDoctorant.getNote5()).isEqualTo(UPDATED_NOTE_5);
        assertThat(testFormationDoctorant.getScanneNote5()).isEqualTo(DEFAULT_SCANNE_NOTE_5);
        assertThat(testFormationDoctorant.getScanneNote5ContentType()).isEqualTo(DEFAULT_SCANNE_NOTE_5_CONTENT_TYPE);
        assertThat(testFormationDoctorant.getScanneDiplome()).isEqualTo(UPDATED_SCANNE_DIPLOME);
        assertThat(testFormationDoctorant.getScanneDiplomeContentType()).isEqualTo(UPDATED_SCANNE_DIPLOME_CONTENT_TYPE);
        assertThat(testFormationDoctorant.getMention()).isEqualTo(DEFAULT_MENTION);
    }

    @Test
    @Transactional
    void fullUpdateFormationDoctorantWithPatch() throws Exception {
        // Initialize the database
        formationDoctorantRepository.saveAndFlush(formationDoctorant);

        int databaseSizeBeforeUpdate = formationDoctorantRepository.findAll().size();

        // Update the formationDoctorant using partial update
        FormationDoctorant partialUpdatedFormationDoctorant = new FormationDoctorant();
        partialUpdatedFormationDoctorant.setId(formationDoctorant.getId());

        partialUpdatedFormationDoctorant
            .specialite(UPDATED_SPECIALITE)
            .type(UPDATED_TYPE)
            .dateObtention(UPDATED_DATE_OBTENTION)
            .note1(UPDATED_NOTE_1)
            .scanneNote1(UPDATED_SCANNE_NOTE_1)
            .scanneNote1ContentType(UPDATED_SCANNE_NOTE_1_CONTENT_TYPE)
            .note2(UPDATED_NOTE_2)
            .scanneNote2(UPDATED_SCANNE_NOTE_2)
            .scanneNote2ContentType(UPDATED_SCANNE_NOTE_2_CONTENT_TYPE)
            .note3(UPDATED_NOTE_3)
            .scanneNote3(UPDATED_SCANNE_NOTE_3)
            .scanneNote3ContentType(UPDATED_SCANNE_NOTE_3_CONTENT_TYPE)
            .note4(UPDATED_NOTE_4)
            .scanneNote4(UPDATED_SCANNE_NOTE_4)
            .scanneNote4ContentType(UPDATED_SCANNE_NOTE_4_CONTENT_TYPE)
            .note5(UPDATED_NOTE_5)
            .scanneNote5(UPDATED_SCANNE_NOTE_5)
            .scanneNote5ContentType(UPDATED_SCANNE_NOTE_5_CONTENT_TYPE)
            .scanneDiplome(UPDATED_SCANNE_DIPLOME)
            .scanneDiplomeContentType(UPDATED_SCANNE_DIPLOME_CONTENT_TYPE)
            .mention(UPDATED_MENTION);

        restFormationDoctorantMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFormationDoctorant.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFormationDoctorant))
            )
            .andExpect(status().isOk());

        // Validate the FormationDoctorant in the database
        List<FormationDoctorant> formationDoctorantList = formationDoctorantRepository.findAll();
        assertThat(formationDoctorantList).hasSize(databaseSizeBeforeUpdate);
        FormationDoctorant testFormationDoctorant = formationDoctorantList.get(formationDoctorantList.size() - 1);
        assertThat(testFormationDoctorant.getSpecialite()).isEqualTo(UPDATED_SPECIALITE);
        assertThat(testFormationDoctorant.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testFormationDoctorant.getDateObtention()).isEqualTo(UPDATED_DATE_OBTENTION);
        assertThat(testFormationDoctorant.getNote1()).isEqualTo(UPDATED_NOTE_1);
        assertThat(testFormationDoctorant.getScanneNote1()).isEqualTo(UPDATED_SCANNE_NOTE_1);
        assertThat(testFormationDoctorant.getScanneNote1ContentType()).isEqualTo(UPDATED_SCANNE_NOTE_1_CONTENT_TYPE);
        assertThat(testFormationDoctorant.getNote2()).isEqualTo(UPDATED_NOTE_2);
        assertThat(testFormationDoctorant.getScanneNote2()).isEqualTo(UPDATED_SCANNE_NOTE_2);
        assertThat(testFormationDoctorant.getScanneNote2ContentType()).isEqualTo(UPDATED_SCANNE_NOTE_2_CONTENT_TYPE);
        assertThat(testFormationDoctorant.getNote3()).isEqualTo(UPDATED_NOTE_3);
        assertThat(testFormationDoctorant.getScanneNote3()).isEqualTo(UPDATED_SCANNE_NOTE_3);
        assertThat(testFormationDoctorant.getScanneNote3ContentType()).isEqualTo(UPDATED_SCANNE_NOTE_3_CONTENT_TYPE);
        assertThat(testFormationDoctorant.getNote4()).isEqualTo(UPDATED_NOTE_4);
        assertThat(testFormationDoctorant.getScanneNote4()).isEqualTo(UPDATED_SCANNE_NOTE_4);
        assertThat(testFormationDoctorant.getScanneNote4ContentType()).isEqualTo(UPDATED_SCANNE_NOTE_4_CONTENT_TYPE);
        assertThat(testFormationDoctorant.getNote5()).isEqualTo(UPDATED_NOTE_5);
        assertThat(testFormationDoctorant.getScanneNote5()).isEqualTo(UPDATED_SCANNE_NOTE_5);
        assertThat(testFormationDoctorant.getScanneNote5ContentType()).isEqualTo(UPDATED_SCANNE_NOTE_5_CONTENT_TYPE);
        assertThat(testFormationDoctorant.getScanneDiplome()).isEqualTo(UPDATED_SCANNE_DIPLOME);
        assertThat(testFormationDoctorant.getScanneDiplomeContentType()).isEqualTo(UPDATED_SCANNE_DIPLOME_CONTENT_TYPE);
        assertThat(testFormationDoctorant.getMention()).isEqualTo(UPDATED_MENTION);
    }

    @Test
    @Transactional
    void patchNonExistingFormationDoctorant() throws Exception {
        int databaseSizeBeforeUpdate = formationDoctorantRepository.findAll().size();
        formationDoctorant.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFormationDoctorantMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, formationDoctorant.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(formationDoctorant))
            )
            .andExpect(status().isBadRequest());

        // Validate the FormationDoctorant in the database
        List<FormationDoctorant> formationDoctorantList = formationDoctorantRepository.findAll();
        assertThat(formationDoctorantList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchFormationDoctorant() throws Exception {
        int databaseSizeBeforeUpdate = formationDoctorantRepository.findAll().size();
        formationDoctorant.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFormationDoctorantMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(formationDoctorant))
            )
            .andExpect(status().isBadRequest());

        // Validate the FormationDoctorant in the database
        List<FormationDoctorant> formationDoctorantList = formationDoctorantRepository.findAll();
        assertThat(formationDoctorantList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamFormationDoctorant() throws Exception {
        int databaseSizeBeforeUpdate = formationDoctorantRepository.findAll().size();
        formationDoctorant.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFormationDoctorantMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(formationDoctorant))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the FormationDoctorant in the database
        List<FormationDoctorant> formationDoctorantList = formationDoctorantRepository.findAll();
        assertThat(formationDoctorantList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteFormationDoctorant() throws Exception {
        // Initialize the database
        formationDoctorantRepository.saveAndFlush(formationDoctorant);

        int databaseSizeBeforeDelete = formationDoctorantRepository.findAll().size();

        // Delete the formationDoctorant
        restFormationDoctorantMockMvc
            .perform(delete(ENTITY_API_URL_ID, formationDoctorant.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<FormationDoctorant> formationDoctorantList = formationDoctorantRepository.findAll();
        assertThat(formationDoctorantList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
