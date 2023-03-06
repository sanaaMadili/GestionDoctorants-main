package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.FormationDoctoranle;
import com.mycompany.myapp.repository.DoctorantRepository;
import com.mycompany.myapp.repository.FormationDoctoranleRepository;
import com.mycompany.myapp.repository.UserRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
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
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.FormationDoctoranle}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class FormationDoctoranleResource {

    private final Logger log = LoggerFactory.getLogger(FormationDoctoranleResource.class);

    private static final String ENTITY_NAME = "formationDoctoranle";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FormationDoctoranleRepository formationDoctoranleRepository;

    public FormationDoctoranleResource(FormationDoctoranleRepository formationDoctoranleRepository) {
        this.formationDoctoranleRepository = formationDoctoranleRepository;

    }

    /**
     * {@code POST  /formation-doctoranles} : Create a new formationDoctoranle.
     *
     * @param formationDoctoranle the formationDoctoranle to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new formationDoctoranle, or with status {@code 400 (Bad Request)} if the formationDoctoranle has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/formation-doctoranles")
    public ResponseEntity<FormationDoctoranle> createFormationDoctoranle(@Valid @RequestBody FormationDoctoranle formationDoctoranle)
        throws URISyntaxException {
        log.debug("REST request to save FormationDoctoranle : {}", formationDoctoranle);
        if (formationDoctoranle.getId() != null) {
            throw new BadRequestAlertException("A new formationDoctoranle cannot already have an ID", ENTITY_NAME, "idexists");
        }

        FormationDoctoranle result = formationDoctoranleRepository.save(formationDoctoranle);
        return ResponseEntity
            .created(new URI("/api/formation-doctoranles/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /formation-doctoranles/:id} : Updates an existing formationDoctoranle.
     *
     * @param id the id of the formationDoctoranle to save.
     * @param formationDoctoranle the formationDoctoranle to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated formationDoctoranle,
     * or with status {@code 400 (Bad Request)} if the formationDoctoranle is not valid,
     * or with status {@code 500 (Internal Server Error)} if the formationDoctoranle couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/formation-doctoranles/{id}")
    public ResponseEntity<FormationDoctoranle> updateFormationDoctoranle(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody FormationDoctoranle formationDoctoranle
    ) throws URISyntaxException {
        log.debug("REST request to update FormationDoctoranle : {}, {}", id, formationDoctoranle);
        if (formationDoctoranle.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, formationDoctoranle.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!formationDoctoranleRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        FormationDoctoranle result = formationDoctoranleRepository.save(formationDoctoranle);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, formationDoctoranle.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /formation-doctoranles/:id} : Partial updates given fields of an existing formationDoctoranle, field will ignore if it is null
     *
     * @param id the id of the formationDoctoranle to save.
     * @param formationDoctoranle the formationDoctoranle to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated formationDoctoranle,
     * or with status {@code 400 (Bad Request)} if the formationDoctoranle is not valid,
     * or with status {@code 404 (Not Found)} if the formationDoctoranle is not found,
     * or with status {@code 500 (Internal Server Error)} if the formationDoctoranle couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/formation-doctoranles/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<FormationDoctoranle> partialUpdateFormationDoctoranle(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody FormationDoctoranle formationDoctoranle
    ) throws URISyntaxException {
        log.debug("REST request to partial update FormationDoctoranle partially : {}, {}", id, formationDoctoranle);
        if (formationDoctoranle.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, formationDoctoranle.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!formationDoctoranleRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<FormationDoctoranle> result = formationDoctoranleRepository
            .findById(formationDoctoranle.getId())
            .map(existingFormationDoctoranle -> {
                if (formationDoctoranle.getThematique() != null) {
                    existingFormationDoctoranle.setThematique(formationDoctoranle.getThematique());
                }
                if (formationDoctoranle.getDescription() != null) {
                    existingFormationDoctoranle.setDescription(formationDoctoranle.getDescription());
                }

                return existingFormationDoctoranle;
            })
            .map(formationDoctoranleRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, formationDoctoranle.getId().toString())
        );
    }

    /**
     * {@code GET  /formation-doctoranles} : get all the formationDoctoranles.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of formationDoctoranles in body.
     */
    @GetMapping("/formation-doctoranles")
    public List<FormationDoctoranle> getAllFormationDoctoranles() {
        log.debug("REST request to get all FormationDoctoranles");
        return formationDoctoranleRepository.findAll();
    }

    /**
     * {@code GET  /formation-doctoranles/:id} : get the "id" formationDoctoranle.
     *
     * @param id the id of the formationDoctoranle to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the formationDoctoranle, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/formation-doctoranles/{id}")
    public ResponseEntity<FormationDoctoranle> getFormationDoctoranle(@PathVariable Long id) {
        log.debug("REST request to get FormationDoctoranle : {}", id);
        Optional<FormationDoctoranle> formationDoctoranle = formationDoctoranleRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(formationDoctoranle);
    }

    /**
     * {@code DELETE  /formation-doctoranles/:id} : delete the "id" formationDoctoranle.
     *
     * @param id the id of the formationDoctoranle to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/formation-doctoranles/{id}")
    public ResponseEntity<Void> deleteFormationDoctoranle(@PathVariable Long id) {
        log.debug("REST request to delete FormationDoctoranle : {}", id);
        formationDoctoranleRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
