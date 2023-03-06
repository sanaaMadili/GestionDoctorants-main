package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Doctorant;
import com.mycompany.myapp.domain.Formation;
import com.mycompany.myapp.domain.FormationDoctorant;
import com.mycompany.myapp.repository.DoctorantRepository;
import com.mycompany.myapp.repository.FormationDoctorantRepository;
import com.mycompany.myapp.repository.FormationRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.FormationDoctorant}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class FormationDoctorantResource {

    private final Logger log = LoggerFactory.getLogger(FormationDoctorantResource.class);

    private static final String ENTITY_NAME = "formationDoctorant";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FormationDoctorantRepository formationDoctorantRepository;

    private UserRepository userRepository;
    private DoctorantRepository doctorantRepository;
    private FormationRepository formationRepository;
    public FormationDoctorantResource(UserRepository userRepository, DoctorantRepository doctorantRepository, FormationDoctorantRepository formationDoctorantRepository, FormationRepository formationRepository) {
        this.userRepository = userRepository;
        this.doctorantRepository = doctorantRepository;
        this.formationDoctorantRepository = formationDoctorantRepository;
        this.formationRepository = formationRepository;
    }

    /**
     * {@code POST  /formation-doctorants} : Create a new formationDoctorant.
     *
     * @param formationDoctorant the formationDoctorant to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new formationDoctorant, or with status {@code 400 (Bad Request)} if the formationDoctorant has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/formation-doctorants")
    public ResponseEntity<FormationDoctorant> createFormationDoctorant(@RequestBody FormationDoctorant formationDoctorant)
        throws URISyntaxException {
        log.debug("REST request to save FormationDoctorant : {}", formationDoctorant);
        if (formationDoctorant.getId() != null) {
            throw new BadRequestAlertException("A new formationDoctorant cannot already have an ID", ENTITY_NAME, "idexists");
        }
        formationDoctorant.setDoctorant(doctorantRepository.getByUser(userRepository.getByLogin(SecurityUtils.getCurrentUserLogin().get())));
        List<FormationDoctorant>f=formationDoctorantRepository.getByFormationAndDoctorant(formationDoctorant.getFormation(),formationDoctorant.getDoctorant());
        if (f.isEmpty()) {
            FormationDoctorant result = formationDoctorantRepository.save(formationDoctorant);
            return ResponseEntity
                .created(new URI("/api/formation-doctorants/" + result.getId()))
                .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
                .body(result);
        }else{
            throw new BadRequestAlertException("A new formationDoctorant cannot already have an ID", ENTITY_NAME, "idexists");

        }

    }

    /**
     * {@code PUT  /formation-doctorants/:id} : Updates an existing formationDoctorant.
     *
     * @param id the id of the formationDoctorant to save.
     * @param formationDoctorant the formationDoctorant to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated formationDoctorant,
     * or with status {@code 400 (Bad Request)} if the formationDoctorant is not valid,
     * or with status {@code 500 (Internal Server Error)} if the formationDoctorant couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/formation-doctorants/{id}")
    public ResponseEntity<FormationDoctorant> updateFormationDoctorant(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody FormationDoctorant formationDoctorant
    ) throws URISyntaxException {
        log.debug("REST request to update FormationDoctorant : {}, {}", id, formationDoctorant);
        if (formationDoctorant.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, formationDoctorant.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!formationDoctorantRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }
        formationDoctorant.setDoctorant(doctorantRepository.getByUser(userRepository.getByLogin(SecurityUtils.getCurrentUserLogin().get())));
        FormationDoctorant result = formationDoctorantRepository.save(formationDoctorant);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, formationDoctorant.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /formation-doctorants/:id} : Partial updates given fields of an existing formationDoctorant, field will ignore if it is null
     *
     * @param id the id of the formationDoctorant to save.
     * @param formationDoctorant the formationDoctorant to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated formationDoctorant,
     * or with status {@code 400 (Bad Request)} if the formationDoctorant is not valid,
     * or with status {@code 404 (Not Found)} if the formationDoctorant is not found,
     * or with status {@code 500 (Internal Server Error)} if the formationDoctorant couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/formation-doctorants/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<FormationDoctorant> partialUpdateFormationDoctorant(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody FormationDoctorant formationDoctorant
    ) throws URISyntaxException {
        log.debug("REST request to partial update FormationDoctorant partially : {}, {}", id, formationDoctorant);
        if (formationDoctorant.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, formationDoctorant.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!formationDoctorantRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<FormationDoctorant> result = formationDoctorantRepository
            .findById(formationDoctorant.getId())
            .map(existingFormationDoctorant -> {
                if (formationDoctorant.getSpecialite() != null) {
                    existingFormationDoctorant.setSpecialite(formationDoctorant.getSpecialite());
                }
                if (formationDoctorant.getType() != null) {
                    existingFormationDoctorant.setType(formationDoctorant.getType());
                }
                if (formationDoctorant.getDateObtention() != null) {
                    existingFormationDoctorant.setDateObtention(formationDoctorant.getDateObtention());
                }
                if (formationDoctorant.getNote1() != null) {
                    existingFormationDoctorant.setNote1(formationDoctorant.getNote1());
                }
                if (formationDoctorant.getScanneNote1() != null) {
                    existingFormationDoctorant.setScanneNote1(formationDoctorant.getScanneNote1());
                }
                if (formationDoctorant.getScanneNote1ContentType() != null) {
                    existingFormationDoctorant.setScanneNote1ContentType(formationDoctorant.getScanneNote1ContentType());
                }
                if (formationDoctorant.getNote2() != null) {
                    existingFormationDoctorant.setNote2(formationDoctorant.getNote2());
                }
                if (formationDoctorant.getScanneNote2() != null) {
                    existingFormationDoctorant.setScanneNote2(formationDoctorant.getScanneNote2());
                }
                if (formationDoctorant.getScanneNote2ContentType() != null) {
                    existingFormationDoctorant.setScanneNote2ContentType(formationDoctorant.getScanneNote2ContentType());
                }
                if (formationDoctorant.getNote3() != null) {
                    existingFormationDoctorant.setNote3(formationDoctorant.getNote3());
                }
                if (formationDoctorant.getScanneNote3() != null) {
                    existingFormationDoctorant.setScanneNote3(formationDoctorant.getScanneNote3());
                }
                if (formationDoctorant.getScanneNote3ContentType() != null) {
                    existingFormationDoctorant.setScanneNote3ContentType(formationDoctorant.getScanneNote3ContentType());
                }
                if (formationDoctorant.getNote4() != null) {
                    existingFormationDoctorant.setNote4(formationDoctorant.getNote4());
                }
                if (formationDoctorant.getScanneNote4() != null) {
                    existingFormationDoctorant.setScanneNote4(formationDoctorant.getScanneNote4());
                }
                if (formationDoctorant.getScanneNote4ContentType() != null) {
                    existingFormationDoctorant.setScanneNote4ContentType(formationDoctorant.getScanneNote4ContentType());
                }
                if (formationDoctorant.getNote5() != null) {
                    existingFormationDoctorant.setNote5(formationDoctorant.getNote5());
                }
                if (formationDoctorant.getScanneNote5() != null) {
                    existingFormationDoctorant.setScanneNote5(formationDoctorant.getScanneNote5());
                }
                if (formationDoctorant.getScanneNote5ContentType() != null) {
                    existingFormationDoctorant.setScanneNote5ContentType(formationDoctorant.getScanneNote5ContentType());
                }
                if (formationDoctorant.getScanneDiplome() != null) {
                    existingFormationDoctorant.setScanneDiplome(formationDoctorant.getScanneDiplome());
                }
                if (formationDoctorant.getScanneDiplomeContentType() != null) {
                    existingFormationDoctorant.setScanneDiplomeContentType(formationDoctorant.getScanneDiplomeContentType());
                }
                if (formationDoctorant.getMention() != null) {
                    existingFormationDoctorant.setMention(formationDoctorant.getMention());
                }

                return existingFormationDoctorant;
            })
            .map(formationDoctorantRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, formationDoctorant.getId().toString())
        );
    }

    /**
     * {@code GET  /formation-doctorants} : get all the formationDoctorants.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of formationDoctorants in body.
     */
    @GetMapping("/formation-doctorants")
    public List<FormationDoctorant> getAllFormationDoctorants() {
        log.debug("REST request to get all FormationDoctorants");
        return formationDoctorantRepository.findAll();
    }

    /**
     * {@code GET  /formation-doctorants/:id} : get the "id" formationDoctorant.
     *
     * @param id the id of the formationDoctorant to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the formationDoctorant, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/formation-doctorants/{id}")
    public ResponseEntity<FormationDoctorant> getFormationDoctorant(@PathVariable Long id) {
        log.debug("REST request to get FormationDoctorant : {}", id);
        Optional<FormationDoctorant> formationDoctorant = formationDoctorantRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(formationDoctorant);
    }
    @GetMapping("/formation-doctorants/formation/{formationid}")
    public FormationDoctorant getFormationDoctorantbyFormationAndD(@PathVariable Long formationid) {
        log.debug("REST request to get FormationDoctorant : {}", formationid);
        Doctorant doctorant=doctorantRepository.getByUser(userRepository.getByLogin(SecurityUtils.getCurrentUserLogin().get()));
        Formation formation=formationRepository.getById(formationid);
        List<FormationDoctorant> formationDoctorant=formationDoctorantRepository.getByFormationAndDoctorant(formation,doctorant);
        if(formationDoctorant.size()>0){
            return formationDoctorant.get(0);
        }
        return new FormationDoctorant();

    }

    @GetMapping("/formation-doctorants/formations/")
    public  List<FormationDoctorant> getFormationDoctorantbyD() {
        Doctorant doctorant=doctorantRepository.getByUser(userRepository.getByLogin(SecurityUtils.getCurrentUserLogin().get()));
        List<FormationDoctorant> formationDoctorant=formationDoctorantRepository.getByDoctorant(doctorant);
        return formationDoctorant;
    }

    @GetMapping("/formation-doctorants/formations/{id}")
    public  List<FormationDoctorant> getFormationDoctorantbyDoctorant(@PathVariable Long id) {
        Doctorant doctorant=doctorantRepository.getById(id);
        List<FormationDoctorant> formationDoctorant=formationDoctorantRepository.getByDoctorant(doctorant);
        return formationDoctorant;
    }
    /**
     * {@code DELETE  /formation-doctorants/:id} : delete the "id" formationDoctorant.
     *
     * @param id the id of the formationDoctorant to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/formation-doctorants/{id}")
    public ResponseEntity<Void> deleteFormationDoctorant(@PathVariable Long id) {
        log.debug("REST request to delete FormationDoctorant : {}", id);
        formationDoctorantRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
