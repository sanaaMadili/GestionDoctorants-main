package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.MembreEquipe;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the MembreEquipe entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MembreEquipeRepository extends JpaRepository<MembreEquipe, Long> {}
