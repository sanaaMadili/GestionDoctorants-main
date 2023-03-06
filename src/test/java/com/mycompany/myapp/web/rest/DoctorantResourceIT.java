package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Doctorant;
import com.mycompany.myapp.repository.DoctorantRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
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
 * Integration tests for the {@link DoctorantResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class DoctorantResourceIT {

    private static final String DEFAULT_CNE = "AAAAAAAAAA";
    private static final String UPDATED_CNE = "BBBBBBBBBB";

    private static final Integer DEFAULT_ETAT_PROFESSIONNEL = 0;
    private static final Integer UPDATED_ETAT_PROFESSIONNEL = 1;

    private static final byte[] DEFAULT_PHOTO_CNE_PILE = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_PHOTO_CNE_PILE = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_PHOTO_CNE_PILE_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_PHOTO_CNE_PILE_CONTENT_TYPE = "image/png";

    private static final byte[] DEFAULT_PHOTO_CNE_FACE = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_PHOTO_CNE_FACE = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_PHOTO_CNE_FACE_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_PHOTO_CNE_FACE_CONTENT_TYPE = "image/png";

    private static final byte[] DEFAULT_PHOTO_CV = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_PHOTO_CV = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_PHOTO_CV_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_PHOTO_CV_CONTENT_TYPE = "image/png";

    private static final Integer DEFAULT_ANNEE_INSCRIPTION = 1;
    private static final Integer UPDATED_ANNEE_INSCRIPTION = 2;

    private static final Integer DEFAULT_ETAT_DOSSIER = 1;
    private static final Integer UPDATED_ETAT_DOSSIER = 2;

    private static final String DEFAULT_CIN = "AAAAAAAAAA";
    private static final String UPDATED_CIN = "BBBBBBBBBB";

    private static final Instant DEFAULT_DATE_NAISSANCE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE_NAISSANCE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_LIEU_NAISSANCE = "AAAAAAAAAA";
    private static final String UPDATED_LIEU_NAISSANCE = "BBBBBBBBBB";

    private static final String DEFAULT_NATIONALITE = "AAAAAAAAAA";
    private static final String UPDATED_NATIONALITE = "BBBBBBBBBB";

    private static final String DEFAULT_ADRESSE = "AAAAAAAAAA";
    private static final String UPDATED_ADRESSE = "BBBBBBBBBB";

    private static final Integer DEFAULT_NUMERO_TELEPHONE = 1;
    private static final Integer UPDATED_NUMERO_TELEPHONE = 2;

    private static final String DEFAULT_GENRE = "AAAAAAAAAA";
    private static final String UPDATED_GENRE = "BBBBBBBBBB";

    private static final String DEFAULT_NOM_ARABE = "AAAAAAAAAA";
    private static final String UPDATED_NOM_ARABE = "BBBBBBBBBB";

    private static final String DEFAULT_PRNOM_ARABE = "AAAAAAAAAA";
    private static final String UPDATED_PRNOM_ARABE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/doctorants";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private DoctorantRepository doctorantRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restDoctorantMockMvc;

    private Doctorant doctorant;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Doctorant createEntity(EntityManager em) {
        Doctorant doctorant = new Doctorant()
            .cne(DEFAULT_CNE)
            .etatProfessionnel(DEFAULT_ETAT_PROFESSIONNEL)
            .photoCNEPile(DEFAULT_PHOTO_CNE_PILE)
            .photoCNEPileContentType(DEFAULT_PHOTO_CNE_PILE_CONTENT_TYPE)
            .photoCNEFace(DEFAULT_PHOTO_CNE_FACE)
            .photoCNEFaceContentType(DEFAULT_PHOTO_CNE_FACE_CONTENT_TYPE)
            .photoCv(DEFAULT_PHOTO_CV)
            .photoCvContentType(DEFAULT_PHOTO_CV_CONTENT_TYPE)
            .anneeInscription(DEFAULT_ANNEE_INSCRIPTION)
            .etatDossier(DEFAULT_ETAT_DOSSIER)
            .cin(DEFAULT_CIN)
            .dateNaissance(DEFAULT_DATE_NAISSANCE)
            .lieuNaissance(DEFAULT_LIEU_NAISSANCE)
            .nationalite(DEFAULT_NATIONALITE)
            .adresse(DEFAULT_ADRESSE)
            .numeroTelephone(DEFAULT_NUMERO_TELEPHONE)
            .genre(DEFAULT_GENRE)
            .nomArabe(DEFAULT_NOM_ARABE)
            .prnomArabe(DEFAULT_PRNOM_ARABE);
        return doctorant;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Doctorant createUpdatedEntity(EntityManager em) {
        Doctorant doctorant = new Doctorant()
            .cne(UPDATED_CNE)
            .etatProfessionnel(UPDATED_ETAT_PROFESSIONNEL)
            .photoCNEPile(UPDATED_PHOTO_CNE_PILE)
            .photoCNEPileContentType(UPDATED_PHOTO_CNE_PILE_CONTENT_TYPE)
            .photoCNEFace(UPDATED_PHOTO_CNE_FACE)
            .photoCNEFaceContentType(UPDATED_PHOTO_CNE_FACE_CONTENT_TYPE)
            .photoCv(UPDATED_PHOTO_CV)
            .photoCvContentType(UPDATED_PHOTO_CV_CONTENT_TYPE)
            .anneeInscription(UPDATED_ANNEE_INSCRIPTION)
            .etatDossier(UPDATED_ETAT_DOSSIER)
            .cin(UPDATED_CIN)
            .dateNaissance(UPDATED_DATE_NAISSANCE)
            .lieuNaissance(UPDATED_LIEU_NAISSANCE)
            .nationalite(UPDATED_NATIONALITE)
            .adresse(UPDATED_ADRESSE)
            .numeroTelephone(UPDATED_NUMERO_TELEPHONE)
            .genre(UPDATED_GENRE)
            .nomArabe(UPDATED_NOM_ARABE)
            .prnomArabe(UPDATED_PRNOM_ARABE);
        return doctorant;
    }

    @BeforeEach
    public void initTest() {
        doctorant = createEntity(em);
    }

    @Test
    @Transactional
    void createDoctorant() throws Exception {
        int databaseSizeBeforeCreate = doctorantRepository.findAll().size();
        // Create the Doctorant
        restDoctorantMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(doctorant))
            )
            .andExpect(status().isCreated());

        // Validate the Doctorant in the database
        List<Doctorant> doctorantList = doctorantRepository.findAll();
        assertThat(doctorantList).hasSize(databaseSizeBeforeCreate + 1);
        Doctorant testDoctorant = doctorantList.get(doctorantList.size() - 1);
        assertThat(testDoctorant.getCne()).isEqualTo(DEFAULT_CNE);
        assertThat(testDoctorant.getEtatProfessionnel()).isEqualTo(DEFAULT_ETAT_PROFESSIONNEL);
        assertThat(testDoctorant.getPhotoCNEPile()).isEqualTo(DEFAULT_PHOTO_CNE_PILE);
        assertThat(testDoctorant.getPhotoCNEPileContentType()).isEqualTo(DEFAULT_PHOTO_CNE_PILE_CONTENT_TYPE);
        assertThat(testDoctorant.getPhotoCNEFace()).isEqualTo(DEFAULT_PHOTO_CNE_FACE);
        assertThat(testDoctorant.getPhotoCNEFaceContentType()).isEqualTo(DEFAULT_PHOTO_CNE_FACE_CONTENT_TYPE);
        assertThat(testDoctorant.getPhotoCv()).isEqualTo(DEFAULT_PHOTO_CV);
        assertThat(testDoctorant.getPhotoCvContentType()).isEqualTo(DEFAULT_PHOTO_CV_CONTENT_TYPE);
        assertThat(testDoctorant.getAnneeInscription()).isEqualTo(DEFAULT_ANNEE_INSCRIPTION);
        assertThat(testDoctorant.getEtatDossier()).isEqualTo(DEFAULT_ETAT_DOSSIER);
        assertThat(testDoctorant.getCin()).isEqualTo(DEFAULT_CIN);
        assertThat(testDoctorant.getDateNaissance()).isEqualTo(DEFAULT_DATE_NAISSANCE);
        assertThat(testDoctorant.getLieuNaissance()).isEqualTo(DEFAULT_LIEU_NAISSANCE);
        assertThat(testDoctorant.getNationalite()).isEqualTo(DEFAULT_NATIONALITE);
        assertThat(testDoctorant.getAdresse()).isEqualTo(DEFAULT_ADRESSE);
        assertThat(testDoctorant.getNumeroTelephone()).isEqualTo(DEFAULT_NUMERO_TELEPHONE);
        assertThat(testDoctorant.getGenre()).isEqualTo(DEFAULT_GENRE);
        assertThat(testDoctorant.getNomArabe()).isEqualTo(DEFAULT_NOM_ARABE);
        assertThat(testDoctorant.getPrnomArabe()).isEqualTo(DEFAULT_PRNOM_ARABE);
    }

    @Test
    @Transactional
    void createDoctorantWithExistingId() throws Exception {
        // Create the Doctorant with an existing ID
        doctorant.setId(1L);

        int databaseSizeBeforeCreate = doctorantRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restDoctorantMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(doctorant))
            )
            .andExpect(status().isBadRequest());

        // Validate the Doctorant in the database
        List<Doctorant> doctorantList = doctorantRepository.findAll();
        assertThat(doctorantList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkCneIsRequired() throws Exception {
        int databaseSizeBeforeTest = doctorantRepository.findAll().size();
        // set the field null
        doctorant.setCne(null);

        // Create the Doctorant, which fails.

        restDoctorantMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(doctorant))
            )
            .andExpect(status().isBadRequest());

        List<Doctorant> doctorantList = doctorantRepository.findAll();
        assertThat(doctorantList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkEtatProfessionnelIsRequired() throws Exception {
        int databaseSizeBeforeTest = doctorantRepository.findAll().size();
        // set the field null
        doctorant.setEtatProfessionnel(null);

        // Create the Doctorant, which fails.

        restDoctorantMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(doctorant))
            )
            .andExpect(status().isBadRequest());

        List<Doctorant> doctorantList = doctorantRepository.findAll();
        assertThat(doctorantList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkCinIsRequired() throws Exception {
        int databaseSizeBeforeTest = doctorantRepository.findAll().size();
        // set the field null
        doctorant.setCin(null);

        // Create the Doctorant, which fails.

        restDoctorantMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(doctorant))
            )
            .andExpect(status().isBadRequest());

        List<Doctorant> doctorantList = doctorantRepository.findAll();
        assertThat(doctorantList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkDateNaissanceIsRequired() throws Exception {
        int databaseSizeBeforeTest = doctorantRepository.findAll().size();
        // set the field null
        doctorant.setDateNaissance(null);

        // Create the Doctorant, which fails.

        restDoctorantMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(doctorant))
            )
            .andExpect(status().isBadRequest());

        List<Doctorant> doctorantList = doctorantRepository.findAll();
        assertThat(doctorantList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkLieuNaissanceIsRequired() throws Exception {
        int databaseSizeBeforeTest = doctorantRepository.findAll().size();
        // set the field null
        doctorant.setLieuNaissance(null);

        // Create the Doctorant, which fails.

        restDoctorantMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(doctorant))
            )
            .andExpect(status().isBadRequest());

        List<Doctorant> doctorantList = doctorantRepository.findAll();
        assertThat(doctorantList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkNationaliteIsRequired() throws Exception {
        int databaseSizeBeforeTest = doctorantRepository.findAll().size();
        // set the field null
        doctorant.setNationalite(null);

        // Create the Doctorant, which fails.

        restDoctorantMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(doctorant))
            )
            .andExpect(status().isBadRequest());

        List<Doctorant> doctorantList = doctorantRepository.findAll();
        assertThat(doctorantList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkAdresseIsRequired() throws Exception {
        int databaseSizeBeforeTest = doctorantRepository.findAll().size();
        // set the field null
        doctorant.setAdresse(null);

        // Create the Doctorant, which fails.

        restDoctorantMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(doctorant))
            )
            .andExpect(status().isBadRequest());

        List<Doctorant> doctorantList = doctorantRepository.findAll();
        assertThat(doctorantList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkNumeroTelephoneIsRequired() throws Exception {
        int databaseSizeBeforeTest = doctorantRepository.findAll().size();
        // set the field null
        doctorant.setNumeroTelephone(null);

        // Create the Doctorant, which fails.

        restDoctorantMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(doctorant))
            )
            .andExpect(status().isBadRequest());

        List<Doctorant> doctorantList = doctorantRepository.findAll();
        assertThat(doctorantList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkGenreIsRequired() throws Exception {
        int databaseSizeBeforeTest = doctorantRepository.findAll().size();
        // set the field null
        doctorant.setGenre(null);

        // Create the Doctorant, which fails.

        restDoctorantMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(doctorant))
            )
            .andExpect(status().isBadRequest());

        List<Doctorant> doctorantList = doctorantRepository.findAll();
        assertThat(doctorantList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkNomArabeIsRequired() throws Exception {
        int databaseSizeBeforeTest = doctorantRepository.findAll().size();
        // set the field null
        doctorant.setNomArabe(null);

        // Create the Doctorant, which fails.

        restDoctorantMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(doctorant))
            )
            .andExpect(status().isBadRequest());

        List<Doctorant> doctorantList = doctorantRepository.findAll();
        assertThat(doctorantList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkPrnomArabeIsRequired() throws Exception {
        int databaseSizeBeforeTest = doctorantRepository.findAll().size();
        // set the field null
        doctorant.setPrnomArabe(null);

        // Create the Doctorant, which fails.

        restDoctorantMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(doctorant))
            )
            .andExpect(status().isBadRequest());

        List<Doctorant> doctorantList = doctorantRepository.findAll();
        assertThat(doctorantList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllDoctorants() throws Exception {
        // Initialize the database
        doctorantRepository.saveAndFlush(doctorant);

        // Get all the doctorantList
        restDoctorantMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(doctorant.getId().intValue())))
            .andExpect(jsonPath("$.[*].cne").value(hasItem(DEFAULT_CNE)))
            .andExpect(jsonPath("$.[*].etatProfessionnel").value(hasItem(DEFAULT_ETAT_PROFESSIONNEL)))
            .andExpect(jsonPath("$.[*].photoCNEPileContentType").value(hasItem(DEFAULT_PHOTO_CNE_PILE_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].photoCNEPile").value(hasItem(Base64Utils.encodeToString(DEFAULT_PHOTO_CNE_PILE))))
            .andExpect(jsonPath("$.[*].photoCNEFaceContentType").value(hasItem(DEFAULT_PHOTO_CNE_FACE_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].photoCNEFace").value(hasItem(Base64Utils.encodeToString(DEFAULT_PHOTO_CNE_FACE))))
            .andExpect(jsonPath("$.[*].photoCvContentType").value(hasItem(DEFAULT_PHOTO_CV_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].photoCv").value(hasItem(Base64Utils.encodeToString(DEFAULT_PHOTO_CV))))
            .andExpect(jsonPath("$.[*].anneeInscription").value(hasItem(DEFAULT_ANNEE_INSCRIPTION)))
            .andExpect(jsonPath("$.[*].etatDossier").value(hasItem(DEFAULT_ETAT_DOSSIER)))
            .andExpect(jsonPath("$.[*].cin").value(hasItem(DEFAULT_CIN)))
            .andExpect(jsonPath("$.[*].dateNaissance").value(hasItem(DEFAULT_DATE_NAISSANCE.toString())))
            .andExpect(jsonPath("$.[*].lieuNaissance").value(hasItem(DEFAULT_LIEU_NAISSANCE)))
            .andExpect(jsonPath("$.[*].nationalite").value(hasItem(DEFAULT_NATIONALITE)))
            .andExpect(jsonPath("$.[*].adresse").value(hasItem(DEFAULT_ADRESSE)))
            .andExpect(jsonPath("$.[*].numeroTelephone").value(hasItem(DEFAULT_NUMERO_TELEPHONE)))
            .andExpect(jsonPath("$.[*].genre").value(hasItem(DEFAULT_GENRE)))
            .andExpect(jsonPath("$.[*].nomArabe").value(hasItem(DEFAULT_NOM_ARABE)))
            .andExpect(jsonPath("$.[*].prnomArabe").value(hasItem(DEFAULT_PRNOM_ARABE)));
    }

    @Test
    @Transactional
    void getDoctorant() throws Exception {
        // Initialize the database
        doctorantRepository.saveAndFlush(doctorant);

        // Get the doctorant
        restDoctorantMockMvc
            .perform(get(ENTITY_API_URL_ID, doctorant.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(doctorant.getId().intValue()))
            .andExpect(jsonPath("$.cne").value(DEFAULT_CNE))
            .andExpect(jsonPath("$.etatProfessionnel").value(DEFAULT_ETAT_PROFESSIONNEL))
            .andExpect(jsonPath("$.photoCNEPileContentType").value(DEFAULT_PHOTO_CNE_PILE_CONTENT_TYPE))
            .andExpect(jsonPath("$.photoCNEPile").value(Base64Utils.encodeToString(DEFAULT_PHOTO_CNE_PILE)))
            .andExpect(jsonPath("$.photoCNEFaceContentType").value(DEFAULT_PHOTO_CNE_FACE_CONTENT_TYPE))
            .andExpect(jsonPath("$.photoCNEFace").value(Base64Utils.encodeToString(DEFAULT_PHOTO_CNE_FACE)))
            .andExpect(jsonPath("$.photoCvContentType").value(DEFAULT_PHOTO_CV_CONTENT_TYPE))
            .andExpect(jsonPath("$.photoCv").value(Base64Utils.encodeToString(DEFAULT_PHOTO_CV)))
            .andExpect(jsonPath("$.anneeInscription").value(DEFAULT_ANNEE_INSCRIPTION))
            .andExpect(jsonPath("$.etatDossier").value(DEFAULT_ETAT_DOSSIER))
            .andExpect(jsonPath("$.cin").value(DEFAULT_CIN))
            .andExpect(jsonPath("$.dateNaissance").value(DEFAULT_DATE_NAISSANCE.toString()))
            .andExpect(jsonPath("$.lieuNaissance").value(DEFAULT_LIEU_NAISSANCE))
            .andExpect(jsonPath("$.nationalite").value(DEFAULT_NATIONALITE))
            .andExpect(jsonPath("$.adresse").value(DEFAULT_ADRESSE))
            .andExpect(jsonPath("$.numeroTelephone").value(DEFAULT_NUMERO_TELEPHONE))
            .andExpect(jsonPath("$.genre").value(DEFAULT_GENRE))
            .andExpect(jsonPath("$.nomArabe").value(DEFAULT_NOM_ARABE))
            .andExpect(jsonPath("$.prnomArabe").value(DEFAULT_PRNOM_ARABE));
    }

    @Test
    @Transactional
    void getNonExistingDoctorant() throws Exception {
        // Get the doctorant
        restDoctorantMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewDoctorant() throws Exception {
        // Initialize the database
        doctorantRepository.saveAndFlush(doctorant);

        int databaseSizeBeforeUpdate = doctorantRepository.findAll().size();

        // Update the doctorant
        Doctorant updatedDoctorant = doctorantRepository.findById(doctorant.getId()).get();
        // Disconnect from session so that the updates on updatedDoctorant are not directly saved in db
        em.detach(updatedDoctorant);
        updatedDoctorant
            .cne(UPDATED_CNE)
            .etatProfessionnel(UPDATED_ETAT_PROFESSIONNEL)
            .photoCNEPile(UPDATED_PHOTO_CNE_PILE)
            .photoCNEPileContentType(UPDATED_PHOTO_CNE_PILE_CONTENT_TYPE)
            .photoCNEFace(UPDATED_PHOTO_CNE_FACE)
            .photoCNEFaceContentType(UPDATED_PHOTO_CNE_FACE_CONTENT_TYPE)
            .photoCv(UPDATED_PHOTO_CV)
            .photoCvContentType(UPDATED_PHOTO_CV_CONTENT_TYPE)
            .anneeInscription(UPDATED_ANNEE_INSCRIPTION)
            .etatDossier(UPDATED_ETAT_DOSSIER)
            .cin(UPDATED_CIN)
            .dateNaissance(UPDATED_DATE_NAISSANCE)
            .lieuNaissance(UPDATED_LIEU_NAISSANCE)
            .nationalite(UPDATED_NATIONALITE)
            .adresse(UPDATED_ADRESSE)
            .numeroTelephone(UPDATED_NUMERO_TELEPHONE)
            .genre(UPDATED_GENRE)
            .nomArabe(UPDATED_NOM_ARABE)
            .prnomArabe(UPDATED_PRNOM_ARABE);

        restDoctorantMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedDoctorant.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedDoctorant))
            )
            .andExpect(status().isOk());

        // Validate the Doctorant in the database
        List<Doctorant> doctorantList = doctorantRepository.findAll();
        assertThat(doctorantList).hasSize(databaseSizeBeforeUpdate);
        Doctorant testDoctorant = doctorantList.get(doctorantList.size() - 1);
        assertThat(testDoctorant.getCne()).isEqualTo(UPDATED_CNE);
        assertThat(testDoctorant.getEtatProfessionnel()).isEqualTo(UPDATED_ETAT_PROFESSIONNEL);
        assertThat(testDoctorant.getPhotoCNEPile()).isEqualTo(UPDATED_PHOTO_CNE_PILE);
        assertThat(testDoctorant.getPhotoCNEPileContentType()).isEqualTo(UPDATED_PHOTO_CNE_PILE_CONTENT_TYPE);
        assertThat(testDoctorant.getPhotoCNEFace()).isEqualTo(UPDATED_PHOTO_CNE_FACE);
        assertThat(testDoctorant.getPhotoCNEFaceContentType()).isEqualTo(UPDATED_PHOTO_CNE_FACE_CONTENT_TYPE);
        assertThat(testDoctorant.getPhotoCv()).isEqualTo(UPDATED_PHOTO_CV);
        assertThat(testDoctorant.getPhotoCvContentType()).isEqualTo(UPDATED_PHOTO_CV_CONTENT_TYPE);
        assertThat(testDoctorant.getAnneeInscription()).isEqualTo(UPDATED_ANNEE_INSCRIPTION);
        assertThat(testDoctorant.getEtatDossier()).isEqualTo(UPDATED_ETAT_DOSSIER);
        assertThat(testDoctorant.getCin()).isEqualTo(UPDATED_CIN);
        assertThat(testDoctorant.getDateNaissance()).isEqualTo(UPDATED_DATE_NAISSANCE);
        assertThat(testDoctorant.getLieuNaissance()).isEqualTo(UPDATED_LIEU_NAISSANCE);
        assertThat(testDoctorant.getNationalite()).isEqualTo(UPDATED_NATIONALITE);
        assertThat(testDoctorant.getAdresse()).isEqualTo(UPDATED_ADRESSE);
        assertThat(testDoctorant.getNumeroTelephone()).isEqualTo(UPDATED_NUMERO_TELEPHONE);
        assertThat(testDoctorant.getGenre()).isEqualTo(UPDATED_GENRE);
        assertThat(testDoctorant.getNomArabe()).isEqualTo(UPDATED_NOM_ARABE);
        assertThat(testDoctorant.getPrnomArabe()).isEqualTo(UPDATED_PRNOM_ARABE);
    }

    @Test
    @Transactional
    void putNonExistingDoctorant() throws Exception {
        int databaseSizeBeforeUpdate = doctorantRepository.findAll().size();
        doctorant.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDoctorantMockMvc
            .perform(
                put(ENTITY_API_URL_ID, doctorant.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(doctorant))
            )
            .andExpect(status().isBadRequest());

        // Validate the Doctorant in the database
        List<Doctorant> doctorantList = doctorantRepository.findAll();
        assertThat(doctorantList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchDoctorant() throws Exception {
        int databaseSizeBeforeUpdate = doctorantRepository.findAll().size();
        doctorant.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDoctorantMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(doctorant))
            )
            .andExpect(status().isBadRequest());

        // Validate the Doctorant in the database
        List<Doctorant> doctorantList = doctorantRepository.findAll();
        assertThat(doctorantList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamDoctorant() throws Exception {
        int databaseSizeBeforeUpdate = doctorantRepository.findAll().size();
        doctorant.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDoctorantMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(doctorant))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Doctorant in the database
        List<Doctorant> doctorantList = doctorantRepository.findAll();
        assertThat(doctorantList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateDoctorantWithPatch() throws Exception {
        // Initialize the database
        doctorantRepository.saveAndFlush(doctorant);

        int databaseSizeBeforeUpdate = doctorantRepository.findAll().size();

        // Update the doctorant using partial update
        Doctorant partialUpdatedDoctorant = new Doctorant();
        partialUpdatedDoctorant.setId(doctorant.getId());

        partialUpdatedDoctorant
            .etatProfessionnel(UPDATED_ETAT_PROFESSIONNEL)
            .photoCNEPile(UPDATED_PHOTO_CNE_PILE)
            .photoCNEPileContentType(UPDATED_PHOTO_CNE_PILE_CONTENT_TYPE)
            .anneeInscription(UPDATED_ANNEE_INSCRIPTION)
            .adresse(UPDATED_ADRESSE)
            .nomArabe(UPDATED_NOM_ARABE)
            .prnomArabe(UPDATED_PRNOM_ARABE);

        restDoctorantMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDoctorant.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDoctorant))
            )
            .andExpect(status().isOk());

        // Validate the Doctorant in the database
        List<Doctorant> doctorantList = doctorantRepository.findAll();
        assertThat(doctorantList).hasSize(databaseSizeBeforeUpdate);
        Doctorant testDoctorant = doctorantList.get(doctorantList.size() - 1);
        assertThat(testDoctorant.getCne()).isEqualTo(DEFAULT_CNE);
        assertThat(testDoctorant.getEtatProfessionnel()).isEqualTo(UPDATED_ETAT_PROFESSIONNEL);
        assertThat(testDoctorant.getPhotoCNEPile()).isEqualTo(UPDATED_PHOTO_CNE_PILE);
        assertThat(testDoctorant.getPhotoCNEPileContentType()).isEqualTo(UPDATED_PHOTO_CNE_PILE_CONTENT_TYPE);
        assertThat(testDoctorant.getPhotoCNEFace()).isEqualTo(DEFAULT_PHOTO_CNE_FACE);
        assertThat(testDoctorant.getPhotoCNEFaceContentType()).isEqualTo(DEFAULT_PHOTO_CNE_FACE_CONTENT_TYPE);
        assertThat(testDoctorant.getPhotoCv()).isEqualTo(DEFAULT_PHOTO_CV);
        assertThat(testDoctorant.getPhotoCvContentType()).isEqualTo(DEFAULT_PHOTO_CV_CONTENT_TYPE);
        assertThat(testDoctorant.getAnneeInscription()).isEqualTo(UPDATED_ANNEE_INSCRIPTION);
        assertThat(testDoctorant.getEtatDossier()).isEqualTo(DEFAULT_ETAT_DOSSIER);
        assertThat(testDoctorant.getCin()).isEqualTo(DEFAULT_CIN);
        assertThat(testDoctorant.getDateNaissance()).isEqualTo(DEFAULT_DATE_NAISSANCE);
        assertThat(testDoctorant.getLieuNaissance()).isEqualTo(DEFAULT_LIEU_NAISSANCE);
        assertThat(testDoctorant.getNationalite()).isEqualTo(DEFAULT_NATIONALITE);
        assertThat(testDoctorant.getAdresse()).isEqualTo(UPDATED_ADRESSE);
        assertThat(testDoctorant.getNumeroTelephone()).isEqualTo(DEFAULT_NUMERO_TELEPHONE);
        assertThat(testDoctorant.getGenre()).isEqualTo(DEFAULT_GENRE);
        assertThat(testDoctorant.getNomArabe()).isEqualTo(UPDATED_NOM_ARABE);
        assertThat(testDoctorant.getPrnomArabe()).isEqualTo(UPDATED_PRNOM_ARABE);
    }

    @Test
    @Transactional
    void fullUpdateDoctorantWithPatch() throws Exception {
        // Initialize the database
        doctorantRepository.saveAndFlush(doctorant);

        int databaseSizeBeforeUpdate = doctorantRepository.findAll().size();

        // Update the doctorant using partial update
        Doctorant partialUpdatedDoctorant = new Doctorant();
        partialUpdatedDoctorant.setId(doctorant.getId());

        partialUpdatedDoctorant
            .cne(UPDATED_CNE)
            .etatProfessionnel(UPDATED_ETAT_PROFESSIONNEL)
            .photoCNEPile(UPDATED_PHOTO_CNE_PILE)
            .photoCNEPileContentType(UPDATED_PHOTO_CNE_PILE_CONTENT_TYPE)
            .photoCNEFace(UPDATED_PHOTO_CNE_FACE)
            .photoCNEFaceContentType(UPDATED_PHOTO_CNE_FACE_CONTENT_TYPE)
            .photoCv(UPDATED_PHOTO_CV)
            .photoCvContentType(UPDATED_PHOTO_CV_CONTENT_TYPE)
            .anneeInscription(UPDATED_ANNEE_INSCRIPTION)
            .etatDossier(UPDATED_ETAT_DOSSIER)
            .cin(UPDATED_CIN)
            .dateNaissance(UPDATED_DATE_NAISSANCE)
            .lieuNaissance(UPDATED_LIEU_NAISSANCE)
            .nationalite(UPDATED_NATIONALITE)
            .adresse(UPDATED_ADRESSE)
            .numeroTelephone(UPDATED_NUMERO_TELEPHONE)
            .genre(UPDATED_GENRE)
            .nomArabe(UPDATED_NOM_ARABE)
            .prnomArabe(UPDATED_PRNOM_ARABE);

        restDoctorantMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDoctorant.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDoctorant))
            )
            .andExpect(status().isOk());

        // Validate the Doctorant in the database
        List<Doctorant> doctorantList = doctorantRepository.findAll();
        assertThat(doctorantList).hasSize(databaseSizeBeforeUpdate);
        Doctorant testDoctorant = doctorantList.get(doctorantList.size() - 1);
        assertThat(testDoctorant.getCne()).isEqualTo(UPDATED_CNE);
        assertThat(testDoctorant.getEtatProfessionnel()).isEqualTo(UPDATED_ETAT_PROFESSIONNEL);
        assertThat(testDoctorant.getPhotoCNEPile()).isEqualTo(UPDATED_PHOTO_CNE_PILE);
        assertThat(testDoctorant.getPhotoCNEPileContentType()).isEqualTo(UPDATED_PHOTO_CNE_PILE_CONTENT_TYPE);
        assertThat(testDoctorant.getPhotoCNEFace()).isEqualTo(UPDATED_PHOTO_CNE_FACE);
        assertThat(testDoctorant.getPhotoCNEFaceContentType()).isEqualTo(UPDATED_PHOTO_CNE_FACE_CONTENT_TYPE);
        assertThat(testDoctorant.getPhotoCv()).isEqualTo(UPDATED_PHOTO_CV);
        assertThat(testDoctorant.getPhotoCvContentType()).isEqualTo(UPDATED_PHOTO_CV_CONTENT_TYPE);
        assertThat(testDoctorant.getAnneeInscription()).isEqualTo(UPDATED_ANNEE_INSCRIPTION);
        assertThat(testDoctorant.getEtatDossier()).isEqualTo(UPDATED_ETAT_DOSSIER);
        assertThat(testDoctorant.getCin()).isEqualTo(UPDATED_CIN);
        assertThat(testDoctorant.getDateNaissance()).isEqualTo(UPDATED_DATE_NAISSANCE);
        assertThat(testDoctorant.getLieuNaissance()).isEqualTo(UPDATED_LIEU_NAISSANCE);
        assertThat(testDoctorant.getNationalite()).isEqualTo(UPDATED_NATIONALITE);
        assertThat(testDoctorant.getAdresse()).isEqualTo(UPDATED_ADRESSE);
        assertThat(testDoctorant.getNumeroTelephone()).isEqualTo(UPDATED_NUMERO_TELEPHONE);
        assertThat(testDoctorant.getGenre()).isEqualTo(UPDATED_GENRE);
        assertThat(testDoctorant.getNomArabe()).isEqualTo(UPDATED_NOM_ARABE);
        assertThat(testDoctorant.getPrnomArabe()).isEqualTo(UPDATED_PRNOM_ARABE);
    }

    @Test
    @Transactional
    void patchNonExistingDoctorant() throws Exception {
        int databaseSizeBeforeUpdate = doctorantRepository.findAll().size();
        doctorant.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDoctorantMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, doctorant.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(doctorant))
            )
            .andExpect(status().isBadRequest());

        // Validate the Doctorant in the database
        List<Doctorant> doctorantList = doctorantRepository.findAll();
        assertThat(doctorantList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchDoctorant() throws Exception {
        int databaseSizeBeforeUpdate = doctorantRepository.findAll().size();
        doctorant.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDoctorantMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(doctorant))
            )
            .andExpect(status().isBadRequest());

        // Validate the Doctorant in the database
        List<Doctorant> doctorantList = doctorantRepository.findAll();
        assertThat(doctorantList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamDoctorant() throws Exception {
        int databaseSizeBeforeUpdate = doctorantRepository.findAll().size();
        doctorant.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDoctorantMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(doctorant))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Doctorant in the database
        List<Doctorant> doctorantList = doctorantRepository.findAll();
        assertThat(doctorantList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteDoctorant() throws Exception {
        // Initialize the database
        doctorantRepository.saveAndFlush(doctorant);

        int databaseSizeBeforeDelete = doctorantRepository.findAll().size();

        // Delete the doctorant
        restDoctorantMockMvc
            .perform(delete(ENTITY_API_URL_ID, doctorant.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Doctorant> doctorantList = doctorantRepository.findAll();
        assertThat(doctorantList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
