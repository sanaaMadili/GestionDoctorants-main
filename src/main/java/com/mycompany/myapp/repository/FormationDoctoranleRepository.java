package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.FormationDoctoranle;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the FormationDoctoranle entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FormationDoctoranleRepository extends JpaRepository<FormationDoctoranle, Long> {}
