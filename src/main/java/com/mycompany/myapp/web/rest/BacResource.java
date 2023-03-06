package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Bac;
import com.mycompany.myapp.repository.BacRepository;
import com.mycompany.myapp.repository.DoctorantRepository;
import com.mycompany.myapp.repository.UserRepository;
import com.mycompany.myapp.security.SecurityUtils;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.Bac}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class BacResource {

    private final Logger log = LoggerFactory.getLogger(BacResource.class);

    private static final String ENTITY_NAME = "bac";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DoctorantRepository doctorantRepository;
    private final UserRepository userRepository;
    private final BacRepository bacRepository;

    public BacResource(DoctorantRepository doctorantRepository, UserRepository userRepository, BacRepository bacRepository) {
        this.doctorantRepository = doctorantRepository;
        this.userRepository = userRepository;
        this.bacRepository = bacRepository;
    }

    /**
     * {@code POST  /bacs} : Create a new bac.
     *
     * @param bac the bac to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new bac, or with status {@code 400 (Bad Request)} if the bac has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/bacs")
    public ResponseEntity<Bac> createBac(@RequestBody Bac bac) throws URISyntaxException {
        log.debug("REST request to save Bac : {}", bac);
        if (bac.getId() != null) {
            throw new BadRequestAlertException("A new bac cannot already have an ID", ENTITY_NAME, "idexists");
        }
        bac.setNoteBac(10F);
        bac.setDoctorant(doctorantRepository.getByUser(userRepository.getByLogin(SecurityUtils.getCurrentUserLogin().get())));
        log.debug("walid {}", bac.getDoctorant().getId());
        Bac result = bacRepository.save(bac);
        return ResponseEntity
            .created(new URI("/api/bacs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /bacs/:id} : Updates an existing bac.
     *
     * @param id the id of the bac to save.
     * @param bac the bac to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated bac,
     * or with status {@code 400 (Bad Request)} if the bac is not valid,
     * or with status {@code 500 (Internal Server Error)} if the bac couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/bacs/{id}")
    public ResponseEntity<Bac> updateBac(@PathVariable(value = "id", required = false) final Long id, @RequestBody Bac bac)
        throws URISyntaxException {
        log.debug("REST request to update Bac : {}, {}", id, bac);
        if (bac.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, bac.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!bacRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }
        bac.setDoctorant(doctorantRepository.getByUser(userRepository.getByLogin(SecurityUtils.getCurrentUserLogin().get())));

        Bac result = bacRepository.save(bac);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, bac.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /bacs/:id} : Partial updates given fields of an existing bac, field will ignore if it is null
     *
     * @param id the id of the bac to save.
     * @param bac the bac to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated bac,
     * or with status {@code 400 (Bad Request)} if the bac is not valid,
     * or with status {@code 404 (Not Found)} if the bac is not found,
     * or with status {@code 500 (Internal Server Error)} if the bac couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/bacs/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Bac> partialUpdateBac(@PathVariable(value = "id", required = false) final Long id, @RequestBody Bac bac)
        throws URISyntaxException {
        log.debug("REST request to partial update Bac partially : {}, {}", id, bac);
        if (bac.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, bac.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!bacRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Bac> result = bacRepository
            .findById(bac.getId())
            .map(existingBac -> {
                if (bac.getSerieBac() != null) {
                    existingBac.setSerieBac(bac.getSerieBac());
                }
                if (bac.getTypeBac() != null) {
                    existingBac.setTypeBac(bac.getTypeBac());
                }
                if (bac.getAnneeObtention() != null) {
                    existingBac.setAnneeObtention(bac.getAnneeObtention());
                }
                if (bac.getNoteBac() != null) {
                    existingBac.setNoteBac(bac.getNoteBac());
                }
                if (bac.getScanneBac() != null) {
                    existingBac.setScanneBac(bac.getScanneBac());
                }
                if (bac.getScanneBacContentType() != null) {
                    existingBac.setScanneBacContentType(bac.getScanneBacContentType());
                }
                if (bac.getMention() != null) {
                    existingBac.setMention(bac.getMention());
                }
                if (bac.getVilleObtention() != null) {
                    existingBac.setVilleObtention(bac.getVilleObtention());
                }

                return existingBac;
            })
            .map(bacRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, bac.getId().toString())
        );
    }

    /**
     * {@code GET  /bacs} : get all the bacs.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of bacs in body.
     */
    @GetMapping("/bacs")
    public List<Bac> getAllBacs() {
        log.debug("REST request to get all Bacs");
        return bacRepository.findAll();
    }

    /**
     * {@code GET  /bacs/:id} : get the "id" bac.
     *
     * @param id the id of the bac to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the bac, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/bacs/{id}")
    public ResponseEntity<Bac> getBac(@PathVariable Long id) {
        log.debug("REST request to get Bac : {}", id);
        Optional<Bac> bac = bacRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(bac);
    }

    @GetMapping("/bacs/this")
    public Bac getBacActiveUser() {
        log.debug("REST request to get Bac ");

        Bac bac = bacRepository.getByDoctorant(doctorantRepository.getByUser(userRepository.getByLogin(SecurityUtils.getCurrentUserLogin().get())));
        return bac;

    }
    @GetMapping("/bacs/doctorant/{id}")
    public Bac getBacUser(@PathVariable Long id) {
        log.debug("REST request to get Bac ");

        Bac bac = bacRepository.getByDoctorant(doctorantRepository.getById(id));
        return bac;

    }

    /**
     * {@code DELETE  /bacs/:id} : delete the "id" bac.
     *
     * @param id the id of the bac to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/bacs/{id}")
    public ResponseEntity<Void> deleteBac(@PathVariable Long id) {
        log.debug("REST request to delete Bac : {}", id);
        bacRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
