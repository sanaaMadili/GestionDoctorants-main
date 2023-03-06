package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Publication;
import java.util.List;
import java.util.Optional;
import javax.persistence.EntityManager;
import org.hibernate.annotations.QueryHints;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class PublicationRepositoryWithBagRelationshipsImpl implements PublicationRepositoryWithBagRelationships {

    @Autowired
    private EntityManager entityManager;

    @Override
    public Optional<Publication> fetchBagRelationships(Optional<Publication> publication) {
        return publication.map(this::fetchChercheurs).map(this::fetchChercheurExternes);
    }

    @Override
    public Page<Publication> fetchBagRelationships(Page<Publication> publications) {
        return new PageImpl<>(
            fetchBagRelationships(publications.getContent()),
            publications.getPageable(),
            publications.getTotalElements()
        );
    }

    @Override
    public List<Publication> fetchBagRelationships(List<Publication> publications) {
        return Optional.of(publications).map(this::fetchChercheurs).map(this::fetchChercheurExternes).get();
    }

    Publication fetchChercheurs(Publication result) {
        return entityManager
            .createQuery(
                "select publication from Publication publication left join fetch publication.chercheurs where publication is :publication",
                Publication.class
            )
            .setParameter("publication", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<Publication> fetchChercheurs(List<Publication> publications) {
        return entityManager
            .createQuery(
                "select distinct publication from Publication publication left join fetch publication.chercheurs where publication in :publications",
                Publication.class
            )
            .setParameter("publications", publications)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
    }

    Publication fetchChercheurExternes(Publication result) {
        return entityManager
            .createQuery(
                "select publication from Publication publication left join fetch publication.chercheurExternes where publication is :publication",
                Publication.class
            )
            .setParameter("publication", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<Publication> fetchChercheurExternes(List<Publication> publications) {
        return entityManager
            .createQuery(
                "select distinct publication from Publication publication left join fetch publication.chercheurExternes where publication in :publications",
                Publication.class
            )
            .setParameter("publications", publications)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
    }
}
