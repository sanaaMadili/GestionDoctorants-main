package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.ChercheurExterne;
import com.mycompany.myapp.repository.ChercheurExterneRepository;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link ChercheurExterne}.
 */
@Service
@Transactional
public class ChercheurExterneService {

    private final Logger log = LoggerFactory.getLogger(ChercheurExterneService.class);

    private final ChercheurExterneRepository chercheurExterneRepository;

    public ChercheurExterneService(ChercheurExterneRepository chercheurExterneRepository) {
        this.chercheurExterneRepository = chercheurExterneRepository;
    }

    /**
     * Save a chercheurExterne.
     *
     * @param chercheurExterne the entity to save.
     * @return the persisted entity.
     */
    public ChercheurExterne save(ChercheurExterne chercheurExterne) {
        log.debug("Request to save ChercheurExterne : {}", chercheurExterne);
        return chercheurExterneRepository.save(chercheurExterne);
    }

    /**
     * Partially update a chercheurExterne.
     *
     * @param chercheurExterne the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<ChercheurExterne> partialUpdate(ChercheurExterne chercheurExterne) {
        log.debug("Request to partially update ChercheurExterne : {}", chercheurExterne);

        return chercheurExterneRepository
            .findById(chercheurExterne.getId())
            .map(existingChercheurExterne -> {
                if (chercheurExterne.getNom() != null) {
                    existingChercheurExterne.setNom(chercheurExterne.getNom());
                }
                if (chercheurExterne.getPrenom() != null) {
                    existingChercheurExterne.setPrenom(chercheurExterne.getPrenom());
                }
                if (chercheurExterne.getEmail() != null) {
                    existingChercheurExterne.setEmail(chercheurExterne.getEmail());
                }
                if (chercheurExterne.getPays() != null) {
                    existingChercheurExterne.setPays(chercheurExterne.getPays());
                }
                if (chercheurExterne.getUniversite() != null) {
                    existingChercheurExterne.setUniversite(chercheurExterne.getUniversite());
                }

                return existingChercheurExterne;
            })
            .map(chercheurExterneRepository::save);
    }

    /**
     * Get all the chercheurExternes.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<ChercheurExterne> findAll() {
        log.debug("Request to get all ChercheurExternes");
        return chercheurExterneRepository.findAllWithEagerRelationships();
    }

    /**
     * Get all the chercheurExternes with eager load of many-to-many relationships.
     *
     * @return the list of entities.
     */
    public Page<ChercheurExterne> findAllWithEagerRelationships(Pageable pageable) {
        return chercheurExterneRepository.findAllWithEagerRelationships(pageable);
    }

    /**
     * Get one chercheurExterne by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<ChercheurExterne> findOne(Long id) {
        log.debug("Request to get ChercheurExterne : {}", id);
        return chercheurExterneRepository.findOneWithEagerRelationships(id);
    }

    /**
     * Delete the chercheurExterne by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete ChercheurExterne : {}", id);
        chercheurExterneRepository.deleteById(id);
    }
}
