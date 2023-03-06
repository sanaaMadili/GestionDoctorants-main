package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Information;
import com.mycompany.myapp.repository.InformationRepository;
import com.mycompany.myapp.service.InformationService;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.Information}.
 */
@RestController
@RequestMapping("/api")
public class InformationResource {

    private final Logger log = LoggerFactory.getLogger(InformationResource.class);

    private final InformationService informationService;

    private final InformationRepository informationRepository;

    public InformationResource(InformationService informationService, InformationRepository informationRepository) {
        this.informationService = informationService;
        this.informationRepository = informationRepository;
    }

    /**
     * {@code GET  /information} : get all the information.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of information in body.
     */
    @GetMapping("/information")
    public List<Information> getAllInformation() {
        log.debug("REST request to get all Information");
        return informationService.findAll();
    }

    /**
     * {@code GET  /information/:id} : get the "id" information.
     *
     * @param id the id of the information to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the information, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/information/{id}")
    public ResponseEntity<Information> getInformation(@PathVariable Long id) {
        log.debug("REST request to get Information : {}", id);
        Optional<Information> information = informationService.findOne(id);
        return ResponseUtil.wrapOrNotFound(information);
    }
}
