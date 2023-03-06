package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.charts.Encadrent;
import com.mycompany.myapp.domain.Sujet;
import com.mycompany.myapp.repository.DoctorantRepository;
import com.mycompany.myapp.repository.ExtraUserRepository;
import com.mycompany.myapp.repository.SujetRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.Sujet}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class SujetResource {

    private final Logger log = LoggerFactory.getLogger(SujetResource.class);

    private static final String ENTITY_NAME = "sujet";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;
    private UserRepository userRepository;
    private ExtraUserRepository extraUserRepository;
    private final SujetRepository sujetRepository;
    private DoctorantRepository doctorantRepository;

    public SujetResource(ExtraUserRepository extraUserRepository,UserRepository userRepository,SujetRepository sujetRepository, DoctorantRepository doctorantRepository) {
        this.sujetRepository = sujetRepository;
        this.userRepository = userRepository;
        this.extraUserRepository=extraUserRepository;
        this.doctorantRepository = doctorantRepository;
    }

    /**
     * {@code POST  /sujets} : Create a new sujet.
     *
     * @param sujet the sujet to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new sujet, or with status {@code 400 (Bad Request)} if the sujet has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/sujets")
    public ResponseEntity<Sujet> createSujet(@Valid @RequestBody Sujet sujet) throws URISyntaxException {
        log.debug("REST request to save Sujet : {}", sujet);
        if (sujet.getId() != null) {
            throw new BadRequestAlertException("A new sujet cannot already have an ID", ENTITY_NAME, "idexists");
        }
        sujet.setEncadrent(this.extraUserRepository.getExtraUserByInternalUser(userRepository.getByLogin(SecurityUtils.getCurrentUserLogin().get())));
        Sujet result = sujetRepository.save(sujet);
        return ResponseEntity
            .created(new URI("/api/sujets/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /sujets/:id} : Updates an existing sujet.
     *
     * @param id the id of the sujet to save.
     * @param sujet the sujet to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated sujet,
     * or with status {@code 400 (Bad Request)} if the sujet is not valid,
     * or with status {@code 500 (Internal Server Error)} if the sujet couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/sujets/{id}")
    public ResponseEntity<Sujet> updateSujet(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Sujet sujet)
        throws URISyntaxException {
        log.debug("REST request to update Sujet : {}, {}", id, sujet);
        if (sujet.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, sujet.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!sujetRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Sujet result = sujetRepository.save(sujet);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, sujet.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /sujets/:id} : Partial updates given fields of an existing sujet, field will ignore if it is null
     *
     * @param id the id of the sujet to save.
     * @param sujet the sujet to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated sujet,
     * or with status {@code 400 (Bad Request)} if the sujet is not valid,
     * or with status {@code 404 (Not Found)} if the sujet is not found,
     * or with status {@code 500 (Internal Server Error)} if the sujet couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/sujets/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Sujet> partialUpdateSujet(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Sujet sujet
    ) throws URISyntaxException {
        log.debug("REST request to partial update Sujet partially : {}, {}", id, sujet);
        if (sujet.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, sujet.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!sujetRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Sujet> result = sujetRepository
            .findById(sujet.getId())
            .map(existingSujet -> {
                if (sujet.getTitre() != null) {
                    existingSujet.setTitre(sujet.getTitre());
                }
                if (sujet.getDescription() != null) {
                    existingSujet.setDescription(sujet.getDescription());
                }
                if (sujet.getDomaines() != null) {
                    existingSujet.setDomaines(sujet.getDomaines());
                }
                if (sujet.getMotsCles() != null) {
                    existingSujet.setMotsCles(sujet.getMotsCles());
                }
                if (sujet.getContext() != null) {
                    existingSujet.setContext(sujet.getContext());
                }
                if (sujet.getProfilRecherchees() != null) {
                    existingSujet.setProfilRecherchees(sujet.getProfilRecherchees());
                }
                if (sujet.getAnnee() != null) {
                    existingSujet.setAnnee(sujet.getAnnee());
                }
                if (sujet.getReference() != null) {
                    existingSujet.setReference(sujet.getReference());
                }
                if (sujet.getCandidatures() != null) {
                    existingSujet.setCandidatures(sujet.getCandidatures());
                }
                if (sujet.getCoencadrent() != null) {
                    existingSujet.setCoencadrent(sujet.getCoencadrent());
                }

                return existingSujet;
            })
            .map(sujetRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, sujet.getId().toString())
        );
    }

    /**
     * {@code GET  /sujets} : get all the sujets.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of sujets in body.
     */
    @GetMapping("/sujets")
    public List<Sujet> getAllSujets() {
        log.debug("REST request to get all Sujets");
        return sujetRepository.findAll();
    }
    @GetMapping("/sujets/faty")
    public List<Sujet> getAllSujetss() {
        log.debug("REST request to get all Sujets");
        return sujetRepository.findAll1();
    }


    /**
     * {@code GET  /sujets/:id} : get the "id" sujet.
     *
     * @param id the id of the sujet to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the sujet, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/sujets/{id}")
    public ResponseEntity<Sujet> getSujet(@PathVariable Long id) {
        log.debug("REST request to get Sujet : {}", id);
        Optional<Sujet> sujet = sujetRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(sujet);
    }

    @GetMapping("/sujets/login/{login}")
    public Encadrent getSujetthis(@PathVariable String login) {
        log.debug("REST request to get Sujet : {}");
        Sujet sujet = sujetRepository.getById(doctorantRepository.getByUser(userRepository.getByLogin(login)).getSujet().getId());
        return new Encadrent(sujet.getEncadrent().getInternalUser().getFirstName(),sujet.getEncadrent().getInternalUser().getLastName(),sujet.getTitre());
    }

    /**
     * {@code DELETE  /sujets/:id} : delete the "id" sujet.
     *
     * @param id the id of the sujet to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/sujets/{id}")
    public ResponseEntity<Void> deleteSujet(@PathVariable Long id) {
        log.debug("REST request to delete Sujet : {}", id);
        sujetRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
