package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Doctorant;
import com.mycompany.myapp.domain.Reinscription;
import com.mycompany.myapp.repository.DoctorantRepository;
import com.mycompany.myapp.repository.ReinscriptionRepository;
import com.mycompany.myapp.repository.UserRepository;
import com.mycompany.myapp.security.SecurityUtils;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
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

import javax.xml.crypto.Data;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Reinscription}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ReinscriptionResource {

    private final Logger log = LoggerFactory.getLogger(ReinscriptionResource.class);

    private static final String ENTITY_NAME = "reinscription";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;
    private UserRepository userRepository;
    private DoctorantRepository doctorantRepository;
    private final ReinscriptionRepository reinscriptionRepository;

    public ReinscriptionResource(ReinscriptionRepository reinscriptionRepository,UserRepository userRepository, DoctorantRepository doctorantRepository) {
        this.reinscriptionRepository = reinscriptionRepository;
        this.userRepository = userRepository;
        this.doctorantRepository = doctorantRepository;
    }

    /**
     * {@code POST  /reinscriptions} : Create a new reinscription.
     *
     * @param reinscription the reinscription to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new reinscription, or with status {@code 400 (Bad Request)} if the reinscription has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/reinscriptions")
    public ResponseEntity<Reinscription> createReinscription(@RequestBody Reinscription reinscription) throws URISyntaxException {
        log.debug("REST request to save Reinscription : {}", reinscription);
        if (reinscription.getId() != null) {
            throw new BadRequestAlertException("A new reinscription cannot already have an ID", ENTITY_NAME, "idexists");
        }
        reinscription.setDoctorant(doctorantRepository.getByUser(userRepository.getByLogin(SecurityUtils.getCurrentUserLogin().get())));
        Date date = new Date();
        LocalDate localDate = date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        int year  = localDate.getYear();
        reinscription.setAnnee(Double.valueOf(year));
        Reinscription result = reinscriptionRepository.save(reinscription);
        return ResponseEntity
            .created(new URI("/api/reinscriptions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /reinscriptions/:id} : Updates an existing reinscription.
     *
     * @param id the id of the reinscription to save.
     * @param reinscription the reinscription to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated reinscription,
     * or with status {@code 400 (Bad Request)} if the reinscription is not valid,
     * or with status {@code 500 (Internal Server Error)} if the reinscription couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/reinscriptions/{id}")
    public ResponseEntity<Reinscription> updateReinscription(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Reinscription reinscription
    ) throws URISyntaxException {
        log.debug("REST request to update Reinscription : {}, {}", id, reinscription);
        if (reinscription.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, reinscription.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!reinscriptionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Reinscription result = reinscriptionRepository.save(reinscription);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, reinscription.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /reinscriptions/:id} : Partial updates given fields of an existing reinscription, field will ignore if it is null
     *
     * @param id the id of the reinscription to save.
     * @param reinscription the reinscription to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated reinscription,
     * or with status {@code 400 (Bad Request)} if the reinscription is not valid,
     * or with status {@code 404 (Not Found)} if the reinscription is not found,
     * or with status {@code 500 (Internal Server Error)} if the reinscription couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/reinscriptions/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Reinscription> partialUpdateReinscription(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Reinscription reinscription
    ) throws URISyntaxException {
        log.debug("REST request to partial update Reinscription partially : {}, {}", id, reinscription);
        if (reinscription.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, reinscription.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!reinscriptionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Reinscription> result = reinscriptionRepository
            .findById(reinscription.getId())
            .map(existingReinscription -> {
                if (reinscription.getFormulaireReinscription() != null) {
                    existingReinscription.setFormulaireReinscription(reinscription.getFormulaireReinscription());
                }
                if (reinscription.getFormulaireReinscriptionContentType() != null) {
                    existingReinscription.setFormulaireReinscriptionContentType(reinscription.getFormulaireReinscriptionContentType());
                }
                if (reinscription.getDemande() != null) {
                    existingReinscription.setDemande(reinscription.getDemande());
                }
                if (reinscription.getDemandeContentType() != null) {
                    existingReinscription.setDemandeContentType(reinscription.getDemandeContentType());
                }
                if (reinscription.getAnnee() != null) {
                    existingReinscription.setAnnee(reinscription.getAnnee());
                }

                return existingReinscription;
            })
            .map(reinscriptionRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, reinscription.getId().toString())
        );
    }

    /**
     * {@code GET  /reinscriptions} : get all the reinscriptions.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of reinscriptions in body.
     */
    @GetMapping("/reinscriptions")
    public List<Reinscription> getAllReinscriptions() {
        log.debug("REST request to get all Reinscriptions");
        return reinscriptionRepository.findAll();
    }
    @GetMapping("/reinscriptions/condition")
    public boolean reinscriptionscondition() {
        log.debug("REST request to get all Reinscriptions");
        Doctorant d=doctorantRepository.getByUser(userRepository.getByLogin(SecurityUtils.getCurrentUserLogin().get()));
        Date date = new Date();
        LocalDate localDate = date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        int year  = localDate.getYear();
        Reinscription reinscription =reinscriptionRepository.reinscriptionscondition(Double.valueOf(year),d.getId());
        if(d.getEtatDossier()==0 && reinscription==null ){
            if( d.getAnneeInscription()==year){
                return false;
            }else{
                return true;
            }
        }
        else{
            return false;

        }

    }

    /**
     * {@code GET  /reinscriptions/:id} : get the "id" reinscription.
     *
     * @param id the id of the reinscription to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the reinscription, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/reinscriptions/{id}")
    public ResponseEntity<Reinscription> getReinscription(@PathVariable Long id) {
        log.debug("REST request to get Reinscription : {}", id);
        Optional<Reinscription> reinscription = reinscriptionRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(reinscription);
    }

    /**
     * {@code DELETE  /reinscriptions/:id} : delete the "id" reinscription.
     *
     * @param id the id of the reinscription to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/reinscriptions/{id}")
    public ResponseEntity<Void> deleteReinscription(@PathVariable Long id) {
        log.debug("REST request to delete Reinscription : {}", id);
        reinscriptionRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
