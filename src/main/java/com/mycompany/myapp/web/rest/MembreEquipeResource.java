package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.MembreEquipe;
import com.mycompany.myapp.repository.MembreEquipeRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.MembreEquipe}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class MembreEquipeResource {

    private final Logger log = LoggerFactory.getLogger(MembreEquipeResource.class);

    private static final String ENTITY_NAME = "membreEquipe";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MembreEquipeRepository membreEquipeRepository;
    private UserRepository userRepository;

    public MembreEquipeResource(MembreEquipeRepository membreEquipeRepository,UserRepository userRepository) {
        this.membreEquipeRepository = membreEquipeRepository;
        this.userRepository=userRepository;
    }

    /**
     * {@code POST  /membre-equipes} : Create a new membreEquipe.
     *
     * @param membreEquipe the membreEquipe to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new membreEquipe, or with status {@code 400 (Bad Request)} if the membreEquipe has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/membre-equipes")
    public ResponseEntity<MembreEquipe> createMembreEquipe(@Valid @RequestBody MembreEquipe membreEquipe) throws URISyntaxException {
        log.debug("REST request to save MembreEquipe : {}", membreEquipe);
        if (membreEquipe.getId() != null) {
            throw new BadRequestAlertException("A new membreEquipe cannot already have an ID", ENTITY_NAME, "idexists");
        }
        MembreEquipe result = membreEquipeRepository.save(membreEquipe);
        return ResponseEntity
            .created(new URI("/api/membre-equipes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /membre-equipes/:id} : Updates an existing membreEquipe.
     *
     * @param id the id of the membreEquipe to save.
     * @param membreEquipe the membreEquipe to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated membreEquipe,
     * or with status {@code 400 (Bad Request)} if the membreEquipe is not valid,
     * or with status {@code 500 (Internal Server Error)} if the membreEquipe couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/membre-equipes/{id}")
    public ResponseEntity<MembreEquipe> updateMembreEquipe(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody MembreEquipe membreEquipe
    ) throws URISyntaxException {
        log.debug("REST request to update MembreEquipe : {}, {}", id, membreEquipe);
        if (membreEquipe.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, membreEquipe.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!membreEquipeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        MembreEquipe result = membreEquipeRepository.save(membreEquipe);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, membreEquipe.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /membre-equipes/:id} : Partial updates given fields of an existing membreEquipe, field will ignore if it is null
     *
     * @param id the id of the membreEquipe to save.
     * @param membreEquipe the membreEquipe to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated membreEquipe,
     * or with status {@code 400 (Bad Request)} if the membreEquipe is not valid,
     * or with status {@code 404 (Not Found)} if the membreEquipe is not found,
     * or with status {@code 500 (Internal Server Error)} if the membreEquipe couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/membre-equipes/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<MembreEquipe> partialUpdateMembreEquipe(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody MembreEquipe membreEquipe
    ) throws URISyntaxException {
        log.debug("REST request to partial update MembreEquipe partially : {}, {}", id, membreEquipe);
        if (membreEquipe.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, membreEquipe.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!membreEquipeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<MembreEquipe> result = membreEquipeRepository
            .findById(membreEquipe.getId())
            .map(existingMembreEquipe -> {
                if (membreEquipe.getDateDebut() != null) {
                    existingMembreEquipe.setDateDebut(membreEquipe.getDateDebut());
                }
                if (membreEquipe.getDatefin() != null) {
                    existingMembreEquipe.setDatefin(membreEquipe.getDatefin());
                }

                return existingMembreEquipe;
            })
            .map(membreEquipeRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, membreEquipe.getId().toString())
        );
    }

    /**
     * {@code GET  /membre-equipes} : get all the membreEquipes.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of membreEquipes in body.
     */
    @GetMapping("/membre-equipes")
    public List<MembreEquipe> getAllMembreEquipes() {
        if(SecurityUtils.hasCurrentUserAnyOfAuthorities(AuthoritiesConstants.PROFESSEUR)){
            return  membreEquipeRepository.chefequipe(userRepository.getByLogin(SecurityUtils.getCurrentUserLogin().get()));
        }else{
            return membreEquipeRepository.findAll();
        }

    }
    @GetMapping("/membre-equipes/m")
    public List<MembreEquipe> getAllMembreEquipess() {

            return membreEquipeRepository.findAll();


    }

    @PatchMapping("/membre-equipes/{id}/updatedate")
    public ResponseEntity<Void>  Updatedate(@PathVariable Long id) {
        membreEquipeRepository.updatedate(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();

    }
    /**
     * {@code GET  /membre-equipes/:id} : get the "id" membreEquipe.
     *
     * @param id the id of the membreEquipe to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the membreEquipe, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/membre-equipes/{id}")
    public ResponseEntity<MembreEquipe> getMembreEquipe(@PathVariable Long id) {
        log.debug("REST request to get MembreEquipe : {}", id);
        Optional<MembreEquipe> membreEquipe = membreEquipeRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(membreEquipe);
    }

    /**
     * {@code DELETE  /membre-equipes/:id} : delete the "id" membreEquipe.
     *
     * @param id the id of the membreEquipe to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/membre-equipes/{id}")
    public ResponseEntity<Void> deleteMembreEquipe(@PathVariable Long id) {
        log.debug("REST request to delete MembreEquipe : {}", id);
        membreEquipeRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
