package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Bourse;
import com.mycompany.myapp.repository.BourseRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link BourseResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class BourseResourceIT {

    private static final String DEFAULT_TYPE = "AAAAAAAAAA";
    private static final String UPDATED_TYPE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/bourses";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private BourseRepository bourseRepository;

    @Mock
    private BourseRepository bourseRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restBourseMockMvc;

    private Bourse bourse;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Bourse createEntity(EntityManager em) {
        Bourse bourse = new Bourse().type(DEFAULT_TYPE);
        return bourse;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Bourse createUpdatedEntity(EntityManager em) {
        Bourse bourse = new Bourse().type(UPDATED_TYPE);
        return bourse;
    }

    @BeforeEach
    public void initTest() {
        bourse = createEntity(em);
    }

    @Test
    @Transactional
    void createBourse() throws Exception {
        int databaseSizeBeforeCreate = bourseRepository.findAll().size();
        // Create the Bourse
        restBourseMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(bourse))
            )
            .andExpect(status().isCreated());

        // Validate the Bourse in the database
        List<Bourse> bourseList = bourseRepository.findAll();
        assertThat(bourseList).hasSize(databaseSizeBeforeCreate + 1);
        Bourse testBourse = bourseList.get(bourseList.size() - 1);
        assertThat(testBourse.getType()).isEqualTo(DEFAULT_TYPE);
    }

    @Test
    @Transactional
    void createBourseWithExistingId() throws Exception {
        // Create the Bourse with an existing ID
        bourse.setId(1L);

        int databaseSizeBeforeCreate = bourseRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restBourseMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(bourse))
            )
            .andExpect(status().isBadRequest());

        // Validate the Bourse in the database
        List<Bourse> bourseList = bourseRepository.findAll();
        assertThat(bourseList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllBourses() throws Exception {
        // Initialize the database
        bourseRepository.saveAndFlush(bourse);

        // Get all the bourseList
        restBourseMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(bourse.getId().intValue())))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllBoursesWithEagerRelationshipsIsEnabled() throws Exception {
        when(bourseRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restBourseMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(bourseRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllBoursesWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(bourseRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restBourseMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(bourseRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    void getBourse() throws Exception {
        // Initialize the database
        bourseRepository.saveAndFlush(bourse);

        // Get the bourse
        restBourseMockMvc
            .perform(get(ENTITY_API_URL_ID, bourse.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(bourse.getId().intValue()))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE));
    }

    @Test
    @Transactional
    void getNonExistingBourse() throws Exception {
        // Get the bourse
        restBourseMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewBourse() throws Exception {
        // Initialize the database
        bourseRepository.saveAndFlush(bourse);

        int databaseSizeBeforeUpdate = bourseRepository.findAll().size();

        // Update the bourse
        Bourse updatedBourse = bourseRepository.findById(bourse.getId()).get();
        // Disconnect from session so that the updates on updatedBourse are not directly saved in db
        em.detach(updatedBourse);
        updatedBourse.type(UPDATED_TYPE);

        restBourseMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedBourse.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedBourse))
            )
            .andExpect(status().isOk());

        // Validate the Bourse in the database
        List<Bourse> bourseList = bourseRepository.findAll();
        assertThat(bourseList).hasSize(databaseSizeBeforeUpdate);
        Bourse testBourse = bourseList.get(bourseList.size() - 1);
        assertThat(testBourse.getType()).isEqualTo(UPDATED_TYPE);
    }

    @Test
    @Transactional
    void putNonExistingBourse() throws Exception {
        int databaseSizeBeforeUpdate = bourseRepository.findAll().size();
        bourse.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBourseMockMvc
            .perform(
                put(ENTITY_API_URL_ID, bourse.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(bourse))
            )
            .andExpect(status().isBadRequest());

        // Validate the Bourse in the database
        List<Bourse> bourseList = bourseRepository.findAll();
        assertThat(bourseList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchBourse() throws Exception {
        int databaseSizeBeforeUpdate = bourseRepository.findAll().size();
        bourse.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBourseMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(bourse))
            )
            .andExpect(status().isBadRequest());

        // Validate the Bourse in the database
        List<Bourse> bourseList = bourseRepository.findAll();
        assertThat(bourseList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamBourse() throws Exception {
        int databaseSizeBeforeUpdate = bourseRepository.findAll().size();
        bourse.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBourseMockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(bourse))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Bourse in the database
        List<Bourse> bourseList = bourseRepository.findAll();
        assertThat(bourseList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateBourseWithPatch() throws Exception {
        // Initialize the database
        bourseRepository.saveAndFlush(bourse);

        int databaseSizeBeforeUpdate = bourseRepository.findAll().size();

        // Update the bourse using partial update
        Bourse partialUpdatedBourse = new Bourse();
        partialUpdatedBourse.setId(bourse.getId());

        partialUpdatedBourse.type(UPDATED_TYPE);

        restBourseMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBourse.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBourse))
            )
            .andExpect(status().isOk());

        // Validate the Bourse in the database
        List<Bourse> bourseList = bourseRepository.findAll();
        assertThat(bourseList).hasSize(databaseSizeBeforeUpdate);
        Bourse testBourse = bourseList.get(bourseList.size() - 1);
        assertThat(testBourse.getType()).isEqualTo(UPDATED_TYPE);
    }

    @Test
    @Transactional
    void fullUpdateBourseWithPatch() throws Exception {
        // Initialize the database
        bourseRepository.saveAndFlush(bourse);

        int databaseSizeBeforeUpdate = bourseRepository.findAll().size();

        // Update the bourse using partial update
        Bourse partialUpdatedBourse = new Bourse();
        partialUpdatedBourse.setId(bourse.getId());

        partialUpdatedBourse.type(UPDATED_TYPE);

        restBourseMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBourse.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBourse))
            )
            .andExpect(status().isOk());

        // Validate the Bourse in the database
        List<Bourse> bourseList = bourseRepository.findAll();
        assertThat(bourseList).hasSize(databaseSizeBeforeUpdate);
        Bourse testBourse = bourseList.get(bourseList.size() - 1);
        assertThat(testBourse.getType()).isEqualTo(UPDATED_TYPE);
    }

    @Test
    @Transactional
    void patchNonExistingBourse() throws Exception {
        int databaseSizeBeforeUpdate = bourseRepository.findAll().size();
        bourse.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBourseMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, bourse.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(bourse))
            )
            .andExpect(status().isBadRequest());

        // Validate the Bourse in the database
        List<Bourse> bourseList = bourseRepository.findAll();
        assertThat(bourseList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchBourse() throws Exception {
        int databaseSizeBeforeUpdate = bourseRepository.findAll().size();
        bourse.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBourseMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(bourse))
            )
            .andExpect(status().isBadRequest());

        // Validate the Bourse in the database
        List<Bourse> bourseList = bourseRepository.findAll();
        assertThat(bourseList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamBourse() throws Exception {
        int databaseSizeBeforeUpdate = bourseRepository.findAll().size();
        bourse.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBourseMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(bourse))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Bourse in the database
        List<Bourse> bourseList = bourseRepository.findAll();
        assertThat(bourseList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteBourse() throws Exception {
        // Initialize the database
        bourseRepository.saveAndFlush(bourse);

        int databaseSizeBeforeDelete = bourseRepository.findAll().size();

        // Delete the bourse
        restBourseMockMvc
            .perform(delete(ENTITY_API_URL_ID, bourse.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Bourse> bourseList = bourseRepository.findAll();
        assertThat(bourseList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
