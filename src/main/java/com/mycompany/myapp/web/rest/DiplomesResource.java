package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Diplomes;
import com.mycompany.myapp.repository.DiplomesRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Diplomes}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class DiplomesResource {

    private final Logger log = LoggerFactory.getLogger(DiplomesResource.class);

    private static final String ENTITY_NAME = "diplomes";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DiplomesRepository diplomesRepository;

    public DiplomesResource(DiplomesRepository diplomesRepository) {
        this.diplomesRepository = diplomesRepository;
    }

    /**
     * {@code POST  /diplomes} : Create a new diplomes.
     *
     * @param diplomes the diplomes to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new diplomes, or with status {@code 400 (Bad Request)} if the diplomes has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/diplomes")
    public ResponseEntity<Diplomes> createDiplomes(@RequestBody Diplomes diplomes) throws URISyntaxException {
        log.debug("REST request to save Diplomes : {}", diplomes);
        if (diplomes.getId() != null) {
            throw new BadRequestAlertException("A new diplomes cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Diplomes result = diplomesRepository.save(diplomes);
        return ResponseEntity
            .created(new URI("/api/diplomes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /diplomes/:id} : Updates an existing diplomes.
     *
     * @param id the id of the diplomes to save.
     * @param diplomes the diplomes to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated diplomes,
     * or with status {@code 400 (Bad Request)} if the diplomes is not valid,
     * or with status {@code 500 (Internal Server Error)} if the diplomes couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/diplomes/{id}")
    public ResponseEntity<Diplomes> updateDiplomes(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Diplomes diplomes
    ) throws URISyntaxException {
        log.debug("REST request to update Diplomes : {}, {}", id, diplomes);
        if (diplomes.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, diplomes.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!diplomesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Diplomes result = diplomesRepository.save(diplomes);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, diplomes.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /diplomes/:id} : Partial updates given fields of an existing diplomes, field will ignore if it is null
     *
     * @param id the id of the diplomes to save.
     * @param diplomes the diplomes to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated diplomes,
     * or with status {@code 400 (Bad Request)} if the diplomes is not valid,
     * or with status {@code 404 (Not Found)} if the diplomes is not found,
     * or with status {@code 500 (Internal Server Error)} if the diplomes couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/diplomes/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Diplomes> partialUpdateDiplomes(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Diplomes diplomes
    ) throws URISyntaxException {
        log.debug("REST request to partial update Diplomes partially : {}, {}", id, diplomes);
        if (diplomes.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, diplomes.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!diplomesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Diplomes> result = diplomesRepository
            .findById(diplomes.getId())
            .map(existingDiplomes -> {
                return existingDiplomes;
            })
            .map(diplomesRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, diplomes.getId().toString())
        );
    }

    /**
     * {@code GET  /diplomes} : get all the diplomes.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of diplomes in body.
     */
    @GetMapping("/diplomes")
    public List<Diplomes> getAllDiplomes() {
        log.debug("REST request to get all Diplomes");
        return diplomesRepository.findAll();
    }

    /**
     * {@code GET  /diplomes/:id} : get the "id" diplomes.
     *
     * @param id the id of the diplomes to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the diplomes, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/diplomes/{id}")
    public ResponseEntity<Diplomes> getDiplomes(@PathVariable Long id) {
        log.debug("REST request to get Diplomes : {}", id);
        Optional<Diplomes> diplomes = diplomesRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(diplomes);
    }

    /**
     * {@code DELETE  /diplomes/:id} : delete the "id" diplomes.
     *
     * @param id the id of the diplomes to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/diplomes/{id}")
    public ResponseEntity<Void> deleteDiplomes(@PathVariable Long id) {
        log.debug("REST request to delete Diplomes : {}", id);
        diplomesRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
