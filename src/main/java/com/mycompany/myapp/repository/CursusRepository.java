package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Cursus;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Cursus entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CursusRepository extends JpaRepository<Cursus, Long> {}
