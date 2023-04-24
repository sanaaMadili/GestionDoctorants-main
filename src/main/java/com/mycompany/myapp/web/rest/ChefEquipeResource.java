package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.ChefEquipe;
import com.mycompany.myapp.domain.ChefLab;
import com.mycompany.myapp.repository.ChefEquipeRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.ChefEquipe}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ChefEquipeResource {

    private final Logger log = LoggerFactory.getLogger(ChefEquipeResource.class);

    private static final String ENTITY_NAME = "chefEquipe";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;
    private UserRepository userRepository;

    private final ChefEquipeRepository chefEquipeRepository;

    public ChefEquipeResource(ChefEquipeRepository chefEquipeRepository,UserRepository userRepository) {
        this.chefEquipeRepository = chefEquipeRepository;
        this.userRepository=userRepository;
    }

    /**
     * {@code POST  /chef-equipes} : Create a new chefEquipe.
     *
     * @param chefEquipe the chefEquipe to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new chefEquipe, or with status {@code 400 (Bad Request)} if the chefEquipe has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/chef-equipes")
    public ResponseEntity<ChefEquipe> createChefEquipe(@Valid @RequestBody ChefEquipe chefEquipe) throws URISyntaxException {
        log.debug("REST request to save ChefEquipe : {}", chefEquipe);
        if (chefEquipe.getId() != null) {
            throw new BadRequestAlertException("A new chefEquipe cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ChefEquipe result = chefEquipeRepository.save(chefEquipe);
        return ResponseEntity
            .created(new URI("/api/chef-equipes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /chef-equipes/:id} : Updates an existing chefEquipe.
     *
     * @param id the id of the chefEquipe to save.
     * @param chefEquipe the chefEquipe to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated chefEquipe,
     * or with status {@code 400 (Bad Request)} if the chefEquipe is not valid,
     * or with status {@code 500 (Internal Server Error)} if the chefEquipe couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/chef-equipes/{id}")
    public ResponseEntity<ChefEquipe> updateChefEquipe(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody ChefEquipe chefEquipe
    ) throws URISyntaxException {
        log.debug("REST request to update ChefEquipe : {}, {}", id, chefEquipe);
        if (chefEquipe.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, chefEquipe.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!chefEquipeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ChefEquipe result = chefEquipeRepository.save(chefEquipe);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, chefEquipe.getId().toString()))
            .body(result);
    }

    @PatchMapping("/chef-equipes/{id}/updatedate")
    public ResponseEntity<Void>  Updatedate(@PathVariable Long id) {
        chefEquipeRepository.updatedate(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();

    }
    /**
     * {@code PATCH  /chef-equipes/:id} : Partial updates given fields of an existing chefEquipe, field will ignore if it is null
     *
     * @param id the id of the chefEquipe to save.
     * @param chefEquipe the chefEquipe to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated chefEquipe,
     * or with status {@code 400 (Bad Request)} if the chefEquipe is not valid,
     * or with status {@code 404 (Not Found)} if the chefEquipe is not found,
     * or with status {@code 500 (Internal Server Error)} if the chefEquipe couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/chef-equipes/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ChefEquipe> partialUpdateChefEquipe(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody ChefEquipe chefEquipe
    ) throws URISyntaxException {
        log.debug("REST request to partial update ChefEquipe partially : {}, {}", id, chefEquipe);
        if (chefEquipe.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, chefEquipe.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!chefEquipeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ChefEquipe> result = chefEquipeRepository
            .findById(chefEquipe.getId())
            .map(existingChefEquipe -> {
                if (chefEquipe.getDateDebut() != null) {
                    existingChefEquipe.setDateDebut(chefEquipe.getDateDebut());
                }
                if (chefEquipe.getDateFin() != null) {
                    existingChefEquipe.setDateFin(chefEquipe.getDateFin());
                }

                return existingChefEquipe;
            })
            .map(chefEquipeRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, chefEquipe.getId().toString())
        );
    }

    /**
     * {@code GET  /chef-equipes} : get all the chefEquipes.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of chefEquipes in body.
     */
    @GetMapping("/chef-equipes")
    public List<ChefEquipe> getAllChefEquipess(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all ChefEquipes");
        return chefEquipeRepository.findAllWithEagerRelationships();
    }
    @GetMapping("/chef-equipes/paruser")
    public List<ChefEquipe> getAllChefEquipes(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        if(SecurityUtils.hasCurrentUserAnyOfAuthorities(AuthoritiesConstants.PROFESSEUR)){
            return  chefEquipeRepository.chefequipeparuser(userRepository.getByLogin(SecurityUtils.getCurrentUserLogin().get()));
        }else{
            log.debug("REST request to get all ChefLabs");
            return chefEquipeRepository.findAllWithEagerRelationships();
        }
    }
    @GetMapping("/chef-equipes/parcheflab")
    public List<ChefEquipe> getAllChefEquipesparcheflab(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all ChefEquipes");
        return chefEquipeRepository.findAllWithEagerRelationships();
    }
    /**
     * {@code GET  /chef-equipes/:id} : get the "id" chefEquipe.
     *
     * @param id the id of the chefEquipe to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the chefEquipe, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/chef-equipes/{id}")
    public ResponseEntity<ChefEquipe> getChefEquipe(@PathVariable Long id) {
        log.debug("REST request to get ChefEquipe : {}", id);
        Optional<ChefEquipe> chefEquipe = chefEquipeRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(chefEquipe);
    }

    /**
     * {@code DELETE  /chef-equipes/:id} : delete the "id" chefEquipe.
     *
     * @param id the id of the chefEquipe to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/chef-equipes/{id}")
    public ResponseEntity<Void> deleteChefEquipe(@PathVariable Long id) {
        log.debug("REST request to delete ChefEquipe : {}", id);
        chefEquipeRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
