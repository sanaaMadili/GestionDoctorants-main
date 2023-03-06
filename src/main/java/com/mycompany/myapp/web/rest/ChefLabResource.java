package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.ChefLab;
import com.mycompany.myapp.repository.ChefLabRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.service.filter.LocalDateFilter;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.ChefLab}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ChefLabResource {

    private final Logger log = LoggerFactory.getLogger(ChefLabResource.class);

    private static final String ENTITY_NAME = "chefLab";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ChefLabRepository chefLabRepository;

    public ChefLabResource(ChefLabRepository chefLabRepository) {
        this.chefLabRepository = chefLabRepository;
    }

    /**
     * {@code POST  /chef-labs} : Create a new chefLab.
     *
     * @param chefLab the chefLab to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new chefLab, or with status {@code 400 (Bad Request)} if the chefLab has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/chef-labs")
    public ResponseEntity<ChefLab> createChefLab(@Valid @RequestBody ChefLab chefLab) throws URISyntaxException {
        log.debug("REST request to save ChefLab : {}", chefLab);
        if (chefLab.getId() != null) {
            throw new BadRequestAlertException("A new chefLab cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ChefLab result = chefLabRepository.save(chefLab);
        return ResponseEntity
            .created(new URI("/api/chef-labs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /chef-labs/:id} : Updates an existing chefLab.
     *
     * @param id the id of the chefLab to save.
     * @param chefLab the chefLab to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated chefLab,
     * or with status {@code 400 (Bad Request)} if the chefLab is not valid,
     * or with status {@code 500 (Internal Server Error)} if the chefLab couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/chef-labs/{id}")
    public ResponseEntity<ChefLab> updateChefLab(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody ChefLab chefLab
    ) throws URISyntaxException {
        log.debug("REST request to update ChefLab : {}, {}", id, chefLab);
        if (chefLab.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, chefLab.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!chefLabRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ChefLab result = chefLabRepository.save(chefLab);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, chefLab.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /chef-labs/:id} : Partial updates given fields of an existing chefLab, field will ignore if it is null
     *
     * @param id the id of the chefLab to save.
     * @param chefLab the chefLab to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated chefLab,
     * or with status {@code 400 (Bad Request)} if the chefLab is not valid,
     * or with status {@code 404 (Not Found)} if the chefLab is not found,
     * or with status {@code 500 (Internal Server Error)} if the chefLab couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/chef-labs/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ChefLab> partialUpdateChefLab(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody ChefLab chefLab
    ) throws URISyntaxException {
        log.debug("REST request to partial update ChefLab partially : {}, {}", id, chefLab);
        if (chefLab.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, chefLab.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!chefLabRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ChefLab> result = chefLabRepository
            .findById(chefLab.getId())
            .map(existingChefLab -> {
                if (chefLab.getDateDebut() != null) {
                    existingChefLab.setDateDebut(chefLab.getDateDebut());
                }
                if (chefLab.getDateFin() != null) {
                    existingChefLab.setDateFin(chefLab.getDateFin());
                }

                return existingChefLab;
            })
            .map(chefLabRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, chefLab.getId().toString())
        );
    }

    /**
     * {@code GET  /chef-labs} : get all the chefLabs.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of chefLabs in body.
     */
    @GetMapping("/chef-labs")
    public List<ChefLab> getAllChefLabs(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all ChefLabs");
        return chefLabRepository.findAllWithEagerRelationships();
    }

    /**
     * {@code GET  /chef-labs/:id} : get the "id" chefLab.
     *
     * @param id the id of the chefLab to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the chefLab, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/chef-labs/{id}")
    public ResponseEntity<ChefLab> getChefLab(@PathVariable Long id) {
        log.debug("REST request to get ChefLab : {}", id);
        Optional<ChefLab> chefLab = chefLabRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(chefLab);
    }
    @PatchMapping("/chef-labs/{id}/updatedate")
    public ResponseEntity<Void>  Updatedate(@PathVariable Long id) {
        chefLabRepository.updatedate(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();

    }

    /**
     * {@code DELETE  /chef-labs/:id} : delete the "id" chefLab.
     *
     * @param id the id of the chefLab to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/chef-labs/{id}")
    public ResponseEntity<Void> deleteChefLab(@PathVariable Long id) {
        log.debug("REST request to delete ChefLab : {}", id);
        chefLabRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
