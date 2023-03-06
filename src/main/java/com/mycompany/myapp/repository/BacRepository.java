package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Bac;
import com.mycompany.myapp.domain.Doctorant;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Spring Data SQL repository for the Bac entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BacRepository extends JpaRepository<Bac, Long> {
    Bac getByDoctorant(Doctorant doctorant);
}
