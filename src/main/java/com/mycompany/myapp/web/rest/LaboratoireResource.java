package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Laboratoire;
import com.mycompany.myapp.repository.LaboratoireRepository;
import com.mycompany.myapp.repository.UserRepository;
import com.mycompany.myapp.security.AuthoritiesConstants;
import com.mycompany.myapp.security.SecurityUtils;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.Laboratoire}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class LaboratoireResource {

    private final Logger log = LoggerFactory.getLogger(LaboratoireResource.class);

    private static final String ENTITY_NAME = "laboratoire";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;
    private UserRepository userRepository;
    private final LaboratoireRepository laboratoireRepository;

    public LaboratoireResource(LaboratoireRepository laboratoireRepository , UserRepository userRepository) {
        this.laboratoireRepository = laboratoireRepository;
        this.userRepository=userRepository;
    }

    /**
     * {@code POST  /laboratoires} : Create a new laboratoire.
     *
     * @param laboratoire the laboratoire to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new laboratoire, or with status {@code 400 (Bad Request)} if the laboratoire has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/laboratoires")
    public ResponseEntity<Laboratoire> createLaboratoire(@Valid @RequestBody Laboratoire laboratoire) throws URISyntaxException {
        log.debug("REST request to save Laboratoire : {}", laboratoire);
        if (laboratoire.getId() != null) {
            throw new BadRequestAlertException("A new laboratoire cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Laboratoire result = laboratoireRepository.save(laboratoire);
        return ResponseEntity
            .created(new URI("/api/laboratoires/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /laboratoires/:id} : Updates an existing laboratoire.
     *
     * @param id the id of the laboratoire to save.
     * @param laboratoire the laboratoire to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated laboratoire,
     * or with status {@code 400 (Bad Request)} if the laboratoire is not valid,
     * or with status {@code 500 (Internal Server Error)} if the laboratoire couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/laboratoires/{id}")
    public ResponseEntity<Laboratoire> updateLaboratoire(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Laboratoire laboratoire
    ) throws URISyntaxException {
        log.debug("REST request to update Laboratoire : {}, {}", id, laboratoire);
        if (laboratoire.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, laboratoire.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!laboratoireRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Laboratoire result = laboratoireRepository.save(laboratoire);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, laboratoire.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /laboratoires/:id} : Partial updates given fields of an existing laboratoire, field will ignore if it is null
     *
     * @param id the id of the laboratoire to save.
     * @param laboratoire the laboratoire to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated laboratoire,
     * or with status {@code 400 (Bad Request)} if the laboratoire is not valid,
     * or with status {@code 404 (Not Found)} if the laboratoire is not found,
     * or with status {@code 500 (Internal Server Error)} if the laboratoire couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/laboratoires/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Laboratoire> partialUpdateLaboratoire(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Laboratoire laboratoire
    ) throws URISyntaxException {
        log.debug("REST request to partial update Laboratoire partially : {}, {}", id, laboratoire);
        if (laboratoire.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, laboratoire.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!laboratoireRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Laboratoire> result = laboratoireRepository
            .findById(laboratoire.getId())
            .map(existingLaboratoire -> {
                if (laboratoire.getNom() != null) {
                    existingLaboratoire.setNom(laboratoire.getNom());
                }
                if (laboratoire.getAbreviation() != null) {
                    existingLaboratoire.setAbreviation(laboratoire.getAbreviation());
                }

                return existingLaboratoire;
            })
            .map(laboratoireRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, laboratoire.getId().toString())
        );
    }

    /**
     * {@code GET  /laboratoires} : get all the laboratoires.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of laboratoires in body.
     */
    @GetMapping("/laboratoires")
    public List<Laboratoire> getAllLaboratoires() {
        if(SecurityUtils.hasCurrentUserAnyOfAuthorities(AuthoritiesConstants.PROFESSEUR)){
            return  laboratoireRepository.labduprofesseur(userRepository.getByLogin(SecurityUtils.getCurrentUserLogin().get()));
        }else{
            log.debug("REST request to get all Laboratoires");
            return laboratoireRepository.findAll();
        }

    }
    @GetMapping("/laboratoires/nombre")
    public Laboratoire getAllLaboratoiresS() {
        log.debug("REST request to get all Laboratoires");
        return laboratoireRepository.maxid();
    }

    /**
     * {@code GET  /laboratoires/:id} : get the "id" laboratoire.
     *
     * @param id the id of the laboratoire to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the laboratoire, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/laboratoires/{id}")
    public ResponseEntity<Laboratoire> getLaboratoire(@PathVariable Long id) {

        log.debug("REST request to get Laboratoire : {}", id);
        Optional<Laboratoire> laboratoire = laboratoireRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(laboratoire);
    }
    @GetMapping("/laboratoires/list")
    public List<Laboratoire> getLabhorato() {

        return laboratoireRepository.list();
    }

    /**
     * {@code DELETE  /laboratoires/:id} : delete the "id" laboratoire.
     *
     * @param id the id of the laboratoire to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/laboratoires/{id}")
    public ResponseEntity<Void> deleteLaboratoire(@PathVariable Long id) {
        log.debug("REST request to delete Laboratoire : {}", id);
        laboratoireRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
