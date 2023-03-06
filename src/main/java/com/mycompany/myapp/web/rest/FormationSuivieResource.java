package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.charts.Dureepartheme;
import com.mycompany.myapp.domain.FormationSuivie;
import com.mycompany.myapp.repository.DoctorantRepository;
import com.mycompany.myapp.repository.FormationSuivieRepository;
import com.mycompany.myapp.repository.UserRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.FormationSuivie}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class FormationSuivieResource {

    private final Logger log = LoggerFactory.getLogger(FormationSuivieResource.class);

    private static final String ENTITY_NAME = "formationSuivie";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FormationSuivieRepository formationSuivieRepository;
    private UserRepository userRepository;
    private DoctorantRepository doctorantRepository;
    public FormationSuivieResource(FormationSuivieRepository formationSuivieRepository,UserRepository userRepository, DoctorantRepository doctorantRepository) {
        this.formationSuivieRepository = formationSuivieRepository;
        this.userRepository = userRepository;
        this.doctorantRepository = doctorantRepository;
    }

    /**
     * {@code POST  /formation-suivies} : Create a new formationSuivie.
     *
     * @param formationSuivie the formationSuivie to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new formationSuivie, or with status {@code 400 (Bad Request)} if the formationSuivie has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/formation-suivies")
    public ResponseEntity<FormationSuivie> createFormationSuivie(@Valid @RequestBody FormationSuivie formationSuivie)
        throws URISyntaxException {
        log.debug("REST request to save FormationSuivie : {}", formationSuivie);
        if (formationSuivie.getId() != null) {
            throw new BadRequestAlertException("A new formationSuivie cannot already have an ID", ENTITY_NAME, "idexists");
        }
        formationSuivie.setDoctorant(doctorantRepository.getByUser(userRepository.getByLogin(SecurityUtils.getCurrentUserLogin().get())));
        FormationSuivie result = formationSuivieRepository.save(formationSuivie);
        return ResponseEntity
            .created(new URI("/api/formation-suivies/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /formation-suivies/:id} : Updates an existing formationSuivie.
     *
     * @param id the id of the formationSuivie to save.
     * @param formationSuivie the formationSuivie to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated formationSuivie,
     * or with status {@code 400 (Bad Request)} if the formationSuivie is not valid,
     * or with status {@code 500 (Internal Server Error)} if the formationSuivie couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/formation-suivies/{id}")
    public ResponseEntity<FormationSuivie> updateFormationSuivie(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody FormationSuivie formationSuivie
    ) throws URISyntaxException {
        log.debug("REST request to update FormationSuivie : {}, {}", id, formationSuivie);
        if (formationSuivie.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, formationSuivie.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!formationSuivieRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        FormationSuivie result = formationSuivieRepository.save(formationSuivie);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, formationSuivie.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /formation-suivies/:id} : Partial updates given fields of an existing formationSuivie, field will ignore if it is null
     *
     * @param id the id of the formationSuivie to save.
     * @param formationSuivie the formationSuivie to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated formationSuivie,
     * or with status {@code 400 (Bad Request)} if the formationSuivie is not valid,
     * or with status {@code 404 (Not Found)} if the formationSuivie is not found,
     * or with status {@code 500 (Internal Server Error)} if the formationSuivie couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/formation-suivies/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<FormationSuivie> partialUpdateFormationSuivie(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody FormationSuivie formationSuivie
    ) throws URISyntaxException {
        log.debug("REST request to partial update FormationSuivie partially : {}, {}", id, formationSuivie);
        if (formationSuivie.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, formationSuivie.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!formationSuivieRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<FormationSuivie> result = formationSuivieRepository
            .findById(formationSuivie.getId())
            .map(existingFormationSuivie -> {
                if (formationSuivie.getDuree() != null) {
                    existingFormationSuivie.setDuree(formationSuivie.getDuree());
                }
                if (formationSuivie.getAttestation() != null) {
                    existingFormationSuivie.setAttestation(formationSuivie.getAttestation());
                }
                if (formationSuivie.getAttestationContentType() != null) {
                    existingFormationSuivie.setAttestationContentType(formationSuivie.getAttestationContentType());
                }
                if (formationSuivie.getDate() != null) {
                    existingFormationSuivie.setDate(formationSuivie.getDate());
                }
                if (formationSuivie.getTitre() != null) {
                    existingFormationSuivie.setTitre(formationSuivie.getTitre());
                }

                return existingFormationSuivie;
            })
            .map(formationSuivieRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, formationSuivie.getId().toString())
        );
    }

    /**
     * {@code GET  /formation-suivies} : get all the formationSuivies.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of formationSuivies in body.
     */
    @GetMapping("/formation-suivies")
    public List<FormationSuivie> getAllFormationSuivies() {
        log.debug("REST request to get all FormationSuivies");
        return formationSuivieRepository.findAll();
    }

    /**
     * {@code GET  /formation-suivies/:id} : get the "id" formationSuivie.
     *
     * @param id the id of the formationSuivie to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the formationSuivie, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/formation-suivies/{id}")
    public ResponseEntity<FormationSuivie> getFormationSuivie(@PathVariable Long id) {
        log.debug("REST request to get FormationSuivie : {}", id);
        Optional<FormationSuivie> formationSuivie = formationSuivieRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(formationSuivie);
    }
    @GetMapping("/formation-suivies/doctorant/{login}")
    public List<FormationSuivie> getFormationSuivieByDoctorant(@PathVariable String login) {
        log.debug("REST request to get FormationSuivie : {}", login);
        List<FormationSuivie> formationSuivie = formationSuivieRepository.findByDoctorant(doctorantRepository.getByUser(userRepository.getByLogin(login)));
        return formationSuivie;
    }
    @GetMapping("/formation-suivies/doctorant/this")
    public List<FormationSuivie> getFormationSuivieBythis() {
        log.debug("REST request to get FormationSuivie : {}");
        List<FormationSuivie> formationSuivie = formationSuivieRepository.findByDoctorant(doctorantRepository.getByUser(userRepository.getByLogin(SecurityUtils.getCurrentUserLogin().get())));
        return formationSuivie;
    }

    @GetMapping("/formation-suivies/duree/{login}")
    public float SumDuree (@PathVariable String login) {
        log.debug("REST request to get FormationSuivie : {}", login);
        float duree = formationSuivieRepository.sumDuree(doctorantRepository.getByUser(userRepository.getByLogin(login)).getId());
        return duree;
    }
    @GetMapping("/formation-suivies/Dureepartheme/{login}")
    public List<Dureepartheme> Dureepartheme (@PathVariable String login) {
        log.debug("REST request to get FormationSuivie : {}", login);
        List<Dureepartheme> duree = formationSuivieRepository.Dureepartheme(doctorantRepository.getByUser(userRepository.getByLogin(login)).getId());
        return duree;
    }


    /**
     * {@code DELETE  /formation-suivies/:id} : delete the "id" formationSuivie.
     *
     * @param id the id of the formationSuivie to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/formation-suivies/{id}")
    public ResponseEntity<Void> deleteFormationSuivie(@PathVariable Long id) {
        log.debug("REST request to delete FormationSuivie : {}", id);
        formationSuivieRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
