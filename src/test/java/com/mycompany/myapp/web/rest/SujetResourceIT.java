package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Sujet;
import com.mycompany.myapp.repository.SujetRepository;
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
 * Integration tests for the {@link SujetResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SujetResourceIT {

    private static final String DEFAULT_TITRE = "AAAAAAAAAA";
    private static final String UPDATED_TITRE = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String DEFAULT_DOMAINES = "AAAAAAAAAA";
    private static final String UPDATED_DOMAINES = "BBBBBBBBBB";

    private static final String DEFAULT_MOTS_CLES = "AAAAAAAAAA";
    private static final String UPDATED_MOTS_CLES = "BBBBBBBBBB";

    private static final String DEFAULT_CONTEXT = "AAAAAAAAAA";
    private static final String UPDATED_CONTEXT = "BBBBBBBBBB";

    private static final String DEFAULT_PROFIL_RECHERCHEES = "AAAAAAAAAA";
    private static final String UPDATED_PROFIL_RECHERCHEES = "BBBBBBBBBB";

    private static final Integer DEFAULT_ANNEE = 1;
    private static final Integer UPDATED_ANNEE = 2;

    private static final String DEFAULT_REFERENCE = "AAAAAAAAAA";
    private static final String UPDATED_REFERENCE = "BBBBBBBBBB";

    private static final String DEFAULT_CANDIDATURES = "AAAAAAAAAA";
    private static final String UPDATED_CANDIDATURES = "BBBBBBBBBB";

    private static final String DEFAULT_COENCADRENT = "AAAAAAAAAA";
    private static final String UPDATED_COENCADRENT = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/sujets";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private SujetRepository sujetRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSujetMockMvc;

    private Sujet sujet;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Sujet createEntity(EntityManager em) {
        Sujet sujet = new Sujet()
            .titre(DEFAULT_TITRE)
            .description(DEFAULT_DESCRIPTION)
            .domaines(DEFAULT_DOMAINES)
            .motsCles(DEFAULT_MOTS_CLES)
            .context(DEFAULT_CONTEXT)
            .profilRecherchees(DEFAULT_PROFIL_RECHERCHEES)
            .annee(DEFAULT_ANNEE)
            .reference(DEFAULT_REFERENCE)
            .candidatures(DEFAULT_CANDIDATURES)
            .coencadrent(DEFAULT_COENCADRENT);
        return sujet;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Sujet createUpdatedEntity(EntityManager em) {
        Sujet sujet = new Sujet()
            .titre(UPDATED_TITRE)
            .description(UPDATED_DESCRIPTION)
            .domaines(UPDATED_DOMAINES)
            .motsCles(UPDATED_MOTS_CLES)
            .context(UPDATED_CONTEXT)
            .profilRecherchees(UPDATED_PROFIL_RECHERCHEES)
            .annee(UPDATED_ANNEE)
            .reference(UPDATED_REFERENCE)
            .candidatures(UPDATED_CANDIDATURES)
            .coencadrent(UPDATED_COENCADRENT);
        return sujet;
    }

    @BeforeEach
    public void initTest() {
        sujet = createEntity(em);
    }

    @Test
    @Transactional
    void createSujet() throws Exception {
        int databaseSizeBeforeCreate = sujetRepository.findAll().size();
        // Create the Sujet
        restSujetMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sujet))
            )
            .andExpect(status().isCreated());

        // Validate the Sujet in the database
        List<Sujet> sujetList = sujetRepository.findAll();
        assertThat(sujetList).hasSize(databaseSizeBeforeCreate + 1);
        Sujet testSujet = sujetList.get(sujetList.size() - 1);
        assertThat(testSujet.getTitre()).isEqualTo(DEFAULT_TITRE);
        assertThat(testSujet.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testSujet.getDomaines()).isEqualTo(DEFAULT_DOMAINES);
        assertThat(testSujet.getMotsCles()).isEqualTo(DEFAULT_MOTS_CLES);
        assertThat(testSujet.getContext()).isEqualTo(DEFAULT_CONTEXT);
        assertThat(testSujet.getProfilRecherchees()).isEqualTo(DEFAULT_PROFIL_RECHERCHEES);
        assertThat(testSujet.getAnnee()).isEqualTo(DEFAULT_ANNEE);
        assertThat(testSujet.getReference()).isEqualTo(DEFAULT_REFERENCE);
        assertThat(testSujet.getCandidatures()).isEqualTo(DEFAULT_CANDIDATURES);
        assertThat(testSujet.getCoencadrent()).isEqualTo(DEFAULT_COENCADRENT);
    }

    @Test
    @Transactional
    void createSujetWithExistingId() throws Exception {
        // Create the Sujet with an existing ID
        sujet.setId(1L);

        int databaseSizeBeforeCreate = sujetRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSujetMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sujet))
            )
            .andExpect(status().isBadRequest());

        // Validate the Sujet in the database
        List<Sujet> sujetList = sujetRepository.findAll();
        assertThat(sujetList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkTitreIsRequired() throws Exception {
        int databaseSizeBeforeTest = sujetRepository.findAll().size();
        // set the field null
        sujet.setTitre(null);

        // Create the Sujet, which fails.

        restSujetMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sujet))
            )
            .andExpect(status().isBadRequest());

        List<Sujet> sujetList = sujetRepository.findAll();
        assertThat(sujetList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkDescriptionIsRequired() throws Exception {
        int databaseSizeBeforeTest = sujetRepository.findAll().size();
        // set the field null
        sujet.setDescription(null);

        // Create the Sujet, which fails.

        restSujetMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sujet))
            )
            .andExpect(status().isBadRequest());

        List<Sujet> sujetList = sujetRepository.findAll();
        assertThat(sujetList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkAnneeIsRequired() throws Exception {
        int databaseSizeBeforeTest = sujetRepository.findAll().size();
        // set the field null
        sujet.setAnnee(null);

        // Create the Sujet, which fails.

        restSujetMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sujet))
            )
            .andExpect(status().isBadRequest());

        List<Sujet> sujetList = sujetRepository.findAll();
        assertThat(sujetList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllSujets() throws Exception {
        // Initialize the database
        sujetRepository.saveAndFlush(sujet);

        // Get all the sujetList
        restSujetMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(sujet.getId().intValue())))
            .andExpect(jsonPath("$.[*].titre").value(hasItem(DEFAULT_TITRE)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].domaines").value(hasItem(DEFAULT_DOMAINES)))
            .andExpect(jsonPath("$.[*].motsCles").value(hasItem(DEFAULT_MOTS_CLES)))
            .andExpect(jsonPath("$.[*].context").value(hasItem(DEFAULT_CONTEXT)))
            .andExpect(jsonPath("$.[*].profilRecherchees").value(hasItem(DEFAULT_PROFIL_RECHERCHEES)))
            .andExpect(jsonPath("$.[*].annee").value(hasItem(DEFAULT_ANNEE)))
            .andExpect(jsonPath("$.[*].reference").value(hasItem(DEFAULT_REFERENCE)))
            .andExpect(jsonPath("$.[*].candidatures").value(hasItem(DEFAULT_CANDIDATURES)))
            .andExpect(jsonPath("$.[*].coencadrent").value(hasItem(DEFAULT_COENCADRENT)));
    }

    @Test
    @Transactional
    void getSujet() throws Exception {
        // Initialize the database
        sujetRepository.saveAndFlush(sujet);

        // Get the sujet
        restSujetMockMvc
            .perform(get(ENTITY_API_URL_ID, sujet.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(sujet.getId().intValue()))
            .andExpect(jsonPath("$.titre").value(DEFAULT_TITRE))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.domaines").value(DEFAULT_DOMAINES))
            .andExpect(jsonPath("$.motsCles").value(DEFAULT_MOTS_CLES))
            .andExpect(jsonPath("$.context").value(DEFAULT_CONTEXT))
            .andExpect(jsonPath("$.profilRecherchees").value(DEFAULT_PROFIL_RECHERCHEES))
            .andExpect(jsonPath("$.annee").value(DEFAULT_ANNEE))
            .andExpect(jsonPath("$.reference").value(DEFAULT_REFERENCE))
            .andExpect(jsonPath("$.candidatures").value(DEFAULT_CANDIDATURES))
            .andExpect(jsonPath("$.coencadrent").value(DEFAULT_COENCADRENT));
    }

    @Test
    @Transactional
    void getNonExistingSujet() throws Exception {
        // Get the sujet
        restSujetMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewSujet() throws Exception {
        // Initialize the database
        sujetRepository.saveAndFlush(sujet);

        int databaseSizeBeforeUpdate = sujetRepository.findAll().size();

        // Update the sujet
        Sujet updatedSujet = sujetRepository.findById(sujet.getId()).get();
        // Disconnect from session so that the updates on updatedSujet are not directly saved in db
        em.detach(updatedSujet);
        updatedSujet
            .titre(UPDATED_TITRE)
            .description(UPDATED_DESCRIPTION)
            .domaines(UPDATED_DOMAINES)
            .motsCles(UPDATED_MOTS_CLES)
            .context(UPDATED_CONTEXT)
            .profilRecherchees(UPDATED_PROFIL_RECHERCHEES)
            .annee(UPDATED_ANNEE)
            .reference(UPDATED_REFERENCE)
            .candidatures(UPDATED_CANDIDATURES)
            .coencadrent(UPDATED_COENCADRENT);

        restSujetMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSujet.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSujet))
            )
            .andExpect(status().isOk());

        // Validate the Sujet in the database
        List<Sujet> sujetList = sujetRepository.findAll();
        assertThat(sujetList).hasSize(databaseSizeBeforeUpdate);
        Sujet testSujet = sujetList.get(sujetList.size() - 1);
        assertThat(testSujet.getTitre()).isEqualTo(UPDATED_TITRE);
        assertThat(testSujet.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testSujet.getDomaines()).isEqualTo(UPDATED_DOMAINES);
        assertThat(testSujet.getMotsCles()).isEqualTo(UPDATED_MOTS_CLES);
        assertThat(testSujet.getContext()).isEqualTo(UPDATED_CONTEXT);
        assertThat(testSujet.getProfilRecherchees()).isEqualTo(UPDATED_PROFIL_RECHERCHEES);
        assertThat(testSujet.getAnnee()).isEqualTo(UPDATED_ANNEE);
        assertThat(testSujet.getReference()).isEqualTo(UPDATED_REFERENCE);
        assertThat(testSujet.getCandidatures()).isEqualTo(UPDATED_CANDIDATURES);
        assertThat(testSujet.getCoencadrent()).isEqualTo(UPDATED_COENCADRENT);
    }

    @Test
    @Transactional
    void putNonExistingSujet() throws Exception {
        int databaseSizeBeforeUpdate = sujetRepository.findAll().size();
        sujet.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSujetMockMvc
            .perform(
                put(ENTITY_API_URL_ID, sujet.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(sujet))
            )
            .andExpect(status().isBadRequest());

        // Validate the Sujet in the database
        List<Sujet> sujetList = sujetRepository.findAll();
        assertThat(sujetList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSujet() throws Exception {
        int databaseSizeBeforeUpdate = sujetRepository.findAll().size();
        sujet.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSujetMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(sujet))
            )
            .andExpect(status().isBadRequest());

        // Validate the Sujet in the database
        List<Sujet> sujetList = sujetRepository.findAll();
        assertThat(sujetList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSujet() throws Exception {
        int databaseSizeBeforeUpdate = sujetRepository.findAll().size();
        sujet.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSujetMockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sujet))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Sujet in the database
        List<Sujet> sujetList = sujetRepository.findAll();
        assertThat(sujetList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSujetWithPatch() throws Exception {
        // Initialize the database
        sujetRepository.saveAndFlush(sujet);

        int databaseSizeBeforeUpdate = sujetRepository.findAll().size();

        // Update the sujet using partial update
        Sujet partialUpdatedSujet = new Sujet();
        partialUpdatedSujet.setId(sujet.getId());

        partialUpdatedSujet.titre(UPDATED_TITRE).domaines(UPDATED_DOMAINES).context(UPDATED_CONTEXT).candidatures(UPDATED_CANDIDATURES);

        restSujetMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSujet.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSujet))
            )
            .andExpect(status().isOk());

        // Validate the Sujet in the database
        List<Sujet> sujetList = sujetRepository.findAll();
        assertThat(sujetList).hasSize(databaseSizeBeforeUpdate);
        Sujet testSujet = sujetList.get(sujetList.size() - 1);
        assertThat(testSujet.getTitre()).isEqualTo(UPDATED_TITRE);
        assertThat(testSujet.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testSujet.getDomaines()).isEqualTo(UPDATED_DOMAINES);
        assertThat(testSujet.getMotsCles()).isEqualTo(DEFAULT_MOTS_CLES);
        assertThat(testSujet.getContext()).isEqualTo(UPDATED_CONTEXT);
        assertThat(testSujet.getProfilRecherchees()).isEqualTo(DEFAULT_PROFIL_RECHERCHEES);
        assertThat(testSujet.getAnnee()).isEqualTo(DEFAULT_ANNEE);
        assertThat(testSujet.getReference()).isEqualTo(DEFAULT_REFERENCE);
        assertThat(testSujet.getCandidatures()).isEqualTo(UPDATED_CANDIDATURES);
        assertThat(testSujet.getCoencadrent()).isEqualTo(DEFAULT_COENCADRENT);
    }

    @Test
    @Transactional
    void fullUpdateSujetWithPatch() throws Exception {
        // Initialize the database
        sujetRepository.saveAndFlush(sujet);

        int databaseSizeBeforeUpdate = sujetRepository.findAll().size();

        // Update the sujet using partial update
        Sujet partialUpdatedSujet = new Sujet();
        partialUpdatedSujet.setId(sujet.getId());

        partialUpdatedSujet
            .titre(UPDATED_TITRE)
            .description(UPDATED_DESCRIPTION)
            .domaines(UPDATED_DOMAINES)
            .motsCles(UPDATED_MOTS_CLES)
            .context(UPDATED_CONTEXT)
            .profilRecherchees(UPDATED_PROFIL_RECHERCHEES)
            .annee(UPDATED_ANNEE)
            .reference(UPDATED_REFERENCE)
            .candidatures(UPDATED_CANDIDATURES)
            .coencadrent(UPDATED_COENCADRENT);

        restSujetMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSujet.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSujet))
            )
            .andExpect(status().isOk());

        // Validate the Sujet in the database
        List<Sujet> sujetList = sujetRepository.findAll();
        assertThat(sujetList).hasSize(databaseSizeBeforeUpdate);
        Sujet testSujet = sujetList.get(sujetList.size() - 1);
        assertThat(testSujet.getTitre()).isEqualTo(UPDATED_TITRE);
        assertThat(testSujet.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testSujet.getDomaines()).isEqualTo(UPDATED_DOMAINES);
        assertThat(testSujet.getMotsCles()).isEqualTo(UPDATED_MOTS_CLES);
        assertThat(testSujet.getContext()).isEqualTo(UPDATED_CONTEXT);
        assertThat(testSujet.getProfilRecherchees()).isEqualTo(UPDATED_PROFIL_RECHERCHEES);
        assertThat(testSujet.getAnnee()).isEqualTo(UPDATED_ANNEE);
        assertThat(testSujet.getReference()).isEqualTo(UPDATED_REFERENCE);
        assertThat(testSujet.getCandidatures()).isEqualTo(UPDATED_CANDIDATURES);
        assertThat(testSujet.getCoencadrent()).isEqualTo(UPDATED_COENCADRENT);
    }

    @Test
    @Transactional
    void patchNonExistingSujet() throws Exception {
        int databaseSizeBeforeUpdate = sujetRepository.findAll().size();
        sujet.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSujetMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, sujet.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(sujet))
            )
            .andExpect(status().isBadRequest());

        // Validate the Sujet in the database
        List<Sujet> sujetList = sujetRepository.findAll();
        assertThat(sujetList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSujet() throws Exception {
        int databaseSizeBeforeUpdate = sujetRepository.findAll().size();
        sujet.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSujetMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(sujet))
            )
            .andExpect(status().isBadRequest());

        // Validate the Sujet in the database
        List<Sujet> sujetList = sujetRepository.findAll();
        assertThat(sujetList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSujet() throws Exception {
        int databaseSizeBeforeUpdate = sujetRepository.findAll().size();
        sujet.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSujetMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(sujet))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Sujet in the database
        List<Sujet> sujetList = sujetRepository.findAll();
        assertThat(sujetList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSujet() throws Exception {
        // Initialize the database
        sujetRepository.saveAndFlush(sujet);

        int databaseSizeBeforeDelete = sujetRepository.findAll().size();

        // Delete the sujet
        restSujetMockMvc
            .perform(delete(ENTITY_API_URL_ID, sujet.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Sujet> sujetList = sujetRepository.findAll();
        assertThat(sujetList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
