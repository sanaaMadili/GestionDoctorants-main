package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.ChercheurExterne;
import com.mycompany.myapp.repository.ChercheurExterneRepository;
import com.mycompany.myapp.repository.UserRepository;
import com.mycompany.myapp.security.SecurityUtils;
import com.mycompany.myapp.service.ChercheurExterneService;
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
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.ChercheurExterne}.
 */
@RestController
@RequestMapping("/api")
public class ChercheurExterneResource {

    private final Logger log = LoggerFactory.getLogger(ChercheurExterneResource.class);

    private static final String ENTITY_NAME = "chercheurExterne";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ChercheurExterneService chercheurExterneService;

    private final ChercheurExterneRepository chercheurExterneRepository;
    private UserRepository userRepository;
    public ChercheurExterneResource(
        UserRepository userRepository,
        ChercheurExterneService chercheurExterneService,
        ChercheurExterneRepository chercheurExterneRepository
    ) {
        this.chercheurExterneService = chercheurExterneService;
        this.chercheurExterneRepository = chercheurExterneRepository;
        this.userRepository = userRepository;
    }

    /**
     * {@code POST  /chercheur-externes} : Create a new chercheurExterne.
     *
     * @param chercheurExterne the chercheurExterne to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new chercheurExterne, or with status {@code 400 (Bad Request)} if the chercheurExterne has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/chercheur-externes")
    public ResponseEntity<ChercheurExterne> createChercheurExterne(@RequestBody ChercheurExterne chercheurExterne)
        throws URISyntaxException {
        log.debug("REST request to save ChercheurExterne : {}", chercheurExterne);
        if (chercheurExterne.getId() != null) {
            throw new BadRequestAlertException("A new chercheurExterne cannot already have an ID", ENTITY_NAME, "idexists");
        }
        log.debug("REST request to save ChercheurExterne : {}", chercheurExterne);
        chercheurExterne.setUser(userRepository.getByLogin(SecurityUtils.getCurrentUserLogin().get()));
        ChercheurExterne result = chercheurExterneService.save(chercheurExterne);
        return ResponseEntity
            .created(new URI("/api/chercheur-externes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /chercheur-externes/:id} : Updates an existing chercheurExterne.
     *
     * @param id the id of the chercheurExterne to save.
     * @param chercheurExterne the chercheurExterne to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated chercheurExterne,
     * or with status {@code 400 (Bad Request)} if the chercheurExterne is not valid,
     * or with status {@code 500 (Internal Server Error)} if the chercheurExterne couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/chercheur-externes/{id}")
    public ResponseEntity<ChercheurExterne> updateChercheurExterne(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ChercheurExterne chercheurExterne
    ) throws URISyntaxException {
        log.debug("REST request to update ChercheurExterne : {}, {}", id, chercheurExterne);
        if (chercheurExterne.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, chercheurExterne.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!chercheurExterneRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ChercheurExterne result = chercheurExterneService.save(chercheurExterne);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, chercheurExterne.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /chercheur-externes/:id} : Partial updates given fields of an existing chercheurExterne, field will ignore if it is null
     *
     * @param id the id of the chercheurExterne to save.
     * @param chercheurExterne the chercheurExterne to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated chercheurExterne,
     * or with status {@code 400 (Bad Request)} if the chercheurExterne is not valid,
     * or with status {@code 404 (Not Found)} if the chercheurExterne is not found,
     * or with status {@code 500 (Internal Server Error)} if the chercheurExterne couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/chercheur-externes/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ChercheurExterne> partialUpdateChercheurExterne(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ChercheurExterne chercheurExterne
    ) throws URISyntaxException {
        log.debug("REST request to partial update ChercheurExterne partially : {}, {}", id, chercheurExterne);
        if (chercheurExterne.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, chercheurExterne.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!chercheurExterneRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ChercheurExterne> result = chercheurExterneService.partialUpdate(chercheurExterne);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, chercheurExterne.getId().toString())
        );
    }

    /**
     * {@code GET  /chercheur-externes} : get all the chercheurExternes.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of chercheurExternes in body.
     */
    @GetMapping("/chercheur-externes")
    public List<ChercheurExterne> getAllChercheurExternes(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all ChercheurExternes");
        return chercheurExterneRepository.findByUserIsCurrentUser();
    }

    /**
     * {@code GET  /chercheur-externes/:id} : get the "id" chercheurExterne.
     *
     * @param id the id of the chercheurExterne to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the chercheurExterne, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/chercheur-externes/{id}")
    public ResponseEntity<ChercheurExterne> getChercheurExterne(@PathVariable Long id) {
        log.debug("REST request to get ChercheurExterne : {}", id);
        Optional<ChercheurExterne> chercheurExterne = chercheurExterneService.findOne(id);
        return ResponseUtil.wrapOrNotFound(chercheurExterne);
    }

    /**
     * {@code DELETE  /chercheur-externes/:id} : delete the "id" chercheurExterne.
     *
     * @param id the id of the chercheurExterne to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/chercheur-externes/{id}")
    public ResponseEntity<Void> deleteChercheurExterne(@PathVariable Long id) {
        log.debug("REST request to delete ChercheurExterne : {}", id);
        chercheurExterneService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
