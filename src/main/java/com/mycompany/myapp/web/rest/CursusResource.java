package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Cursus;
import com.mycompany.myapp.repository.CursusRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.Cursus}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CursusResource {

    private final Logger log = LoggerFactory.getLogger(CursusResource.class);

    private static final String ENTITY_NAME = "cursus";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CursusRepository cursusRepository;

    public CursusResource(CursusRepository cursusRepository) {
        this.cursusRepository = cursusRepository;
    }

    /**
     * {@code POST  /cursuses} : Create a new cursus.
     *
     * @param cursus the cursus to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new cursus, or with status {@code 400 (Bad Request)} if the cursus has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/cursuses")
    public ResponseEntity<Cursus> createCursus(@RequestBody Cursus cursus) throws URISyntaxException {
        log.debug("REST request to save Cursus : {}", cursus);
        if (cursus.getId() != null) {
            throw new BadRequestAlertException("A new cursus cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Cursus result = cursusRepository.save(cursus);
        return ResponseEntity
            .created(new URI("/api/cursuses/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /cursuses/:id} : Updates an existing cursus.
     *
     * @param id the id of the cursus to save.
     * @param cursus the cursus to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated cursus,
     * or with status {@code 400 (Bad Request)} if the cursus is not valid,
     * or with status {@code 500 (Internal Server Error)} if the cursus couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/cursuses/{id}")
    public ResponseEntity<Cursus> updateCursus(@PathVariable(value = "id", required = false) final Long id, @RequestBody Cursus cursus)
        throws URISyntaxException {
        log.debug("REST request to update Cursus : {}, {}", id, cursus);
        if (cursus.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, cursus.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!cursusRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Cursus result = cursusRepository.save(cursus);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, cursus.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /cursuses/:id} : Partial updates given fields of an existing cursus, field will ignore if it is null
     *
     * @param id the id of the cursus to save.
     * @param cursus the cursus to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated cursus,
     * or with status {@code 400 (Bad Request)} if the cursus is not valid,
     * or with status {@code 404 (Not Found)} if the cursus is not found,
     * or with status {@code 500 (Internal Server Error)} if the cursus couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/cursuses/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Cursus> partialUpdateCursus(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Cursus cursus
    ) throws URISyntaxException {
        log.debug("REST request to partial update Cursus partially : {}, {}", id, cursus);
        if (cursus.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, cursus.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!cursusRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Cursus> result = cursusRepository
            .findById(cursus.getId())
            .map(existingCursus -> {
                if (cursus.getNom() != null) {
                    existingCursus.setNom(cursus.getNom());
                }
                if (cursus.getNbFormation() != null) {
                    existingCursus.setNbFormation(cursus.getNbFormation());
                }

                return existingCursus;
            })
            .map(cursusRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, cursus.getId().toString())
        );
    }

    /**
     * {@code GET  /cursuses} : get all the cursuses.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of cursuses in body.
     */
    @GetMapping("/cursuses")
    public List<Cursus> getAllCursuses() {
        log.debug("REST request to get all Cursuses");
        return cursusRepository.findAll();
    }

    /**
     * {@code GET  /cursuses/:id} : get the "id" cursus.
     *
     * @param id the id of the cursus to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the cursus, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/cursuses/{id}")
    public ResponseEntity<Cursus> getCursus(@PathVariable Long id) {
        log.debug("REST request to get Cursus : {}", id);
        Optional<Cursus> cursus = cursusRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(cursus);
    }

    /**
     * {@code DELETE  /cursuses/:id} : delete the "id" cursus.
     *
     * @param id the id of the cursus to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/cursuses/{id}")
    public ResponseEntity<Void> deleteCursus(@PathVariable Long id) {
        log.debug("REST request to delete Cursus : {}", id);
        cursusRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
