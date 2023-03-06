package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Publication;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

public interface PublicationRepositoryWithBagRelationships {
    Optional<Publication> fetchBagRelationships(Optional<Publication> publication);

    List<Publication> fetchBagRelationships(List<Publication> publications);

    Page<Publication> fetchBagRelationships(Page<Publication> publications);
}
