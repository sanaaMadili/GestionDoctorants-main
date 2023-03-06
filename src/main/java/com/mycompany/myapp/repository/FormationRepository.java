package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Cursus;
import com.mycompany.myapp.domain.Formation;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data SQL repository for the Formation entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FormationRepository extends JpaRepository<Formation, Long> {
    List<Formation> findByCursus(Cursus cursus);
}
