package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Bourse;
import com.mycompany.myapp.repository.BourseRepository;
import com.mycompany.myapp.repository.DoctorantRepository;
import com.mycompany.myapp.repository.UserRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.Bourse}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class BourseResource {

    private final Logger log = LoggerFactory.getLogger(BourseResource.class);

    private static final String ENTITY_NAME = "bourse";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;
    private UserRepository userRepository;

    private final BourseRepository bourseRepository;
    private final DoctorantRepository doctorantRepository;

    public BourseResource(UserRepository userRepository,BourseRepository bourseRepository, DoctorantRepository doctorantRepository) {
        this.bourseRepository = bourseRepository;
        this.doctorantRepository= doctorantRepository;
        this.userRepository = userRepository;

    }

    /**
     * {@code POST  /bourses} : Create a new bourse.
     *
     * @param bourse the bourse to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new bourse, or with status {@code 400 (Bad Request)} if the bourse has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/bourses")
    public ResponseEntity<Bourse> createBourse(@RequestBody Bourse bourse) throws URISyntaxException {
        log.debug("REST request to save Bourse : {}", bourse);
        if (bourse.getId() != null) {
            throw new BadRequestAlertException("A new bourse cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Bourse result = bourseRepository.save(bourse);
        return ResponseEntity
            .created(new URI("/api/bourses/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /bourses/:id} : Updates an existing bourse.
     *
     * @param id the id of the bourse to save.
     * @param bourse the bourse to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated bourse,
     * or with status {@code 400 (Bad Request)} if the bourse is not valid,
     * or with status {@code 500 (Internal Server Error)} if the bourse couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/bourses/{id}")
    public ResponseEntity<Bourse> updateBourse(@PathVariable(value = "id", required = false) final Long id, @RequestBody Bourse bourse)
        throws URISyntaxException {
        log.debug("REST request to update Bourse : {}, {}", id, bourse);
        if (bourse.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, bourse.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!bourseRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Bourse result = bourseRepository.save(bourse);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, bourse.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /bourses/:id} : Partial updates given fields of an existing bourse, field will ignore if it is null
     *
     * @param id the id of the bourse to save.
     * @param bourse the bourse to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated bourse,
     * or with status {@code 400 (Bad Request)} if the bourse is not valid,
     * or with status {@code 404 (Not Found)} if the bourse is not found,
     * or with status {@code 500 (Internal Server Error)} if the bourse couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/bourses/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Bourse> partialUpdateBourse(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Bourse bourse
    ) throws URISyntaxException {
        log.debug("REST request to partial update Bourse partially : {}, {}", id, bourse);
        if (bourse.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, bourse.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!bourseRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Bourse> result = bourseRepository
            .findById(bourse.getId())
            .map(existingBourse -> {
                if (bourse.getType() != null) {
                    existingBourse.setType(bourse.getType());
                }

                return existingBourse;
            })
            .map(bourseRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, bourse.getId().toString())
        );
    }

    /**
     * {@code GET  /bourses} : get all the bourses.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of bourses in body.
     */
    @GetMapping("/bourses")
    public List<Bourse> getAllBourses(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Bourses");
        return bourseRepository.findAllWithEagerRelationships();
    }

    /**
     * {@code GET  /bourses/:id} : get the "id" bourse.
     *
     * @param id the id of the bourse to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the bourse, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/bourses/{id}")
    public ResponseEntity<Bourse> getBourse(@PathVariable Long id) {
        log.debug("REST request to get Bourse : {}", id);
        Optional<Bourse> bourse = bourseRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(bourse);
    }
    @GetMapping("/bourses/doctorant/{login}")
    public Bourse getBourseByDoc(@PathVariable String login) {
        log.debug("REST request to get Bourse : {}", login);
        Bourse bourse = bourseRepository.getByDoctorant(doctorantRepository.getByUser(userRepository.getByLogin(login)));
        return bourse;
    }

    @GetMapping("/bourses/doctorant")
    public ArrayList<Long> getBourseDoc() {
        List<Bourse> b= bourseRepository.findAllWithEagerRelationships();
        ArrayList<Long> doctorant = new ArrayList<>();
        for(Bourse a : b){
            doctorant.add(a.getDoctorant().getId());
        }
        return doctorant;


    }

    /**
     * {@code DELETE  /bourses/:id} : delete the "id" bourse.
     *
     * @param id the id of the bourse to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/bourses/{id}")
    public ResponseEntity<Void> deleteBourse(@PathVariable Long id) {
        log.debug("REST request to delete Bourse : {}", id);
        bourseRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
