package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.ExtraUser;
import com.mycompany.myapp.domain.Laboratoire;
import com.mycompany.myapp.domain.Sujet;
import liquibase.pro.packaged.I;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data SQL repository for the Laboratoire entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LaboratoireRepository extends JpaRepository<Laboratoire, Long> {
    @Query(value = "SELECT id FROM sujet LEFT JOIN doctorant ON sujet.id = doctorant.sujet_id WHERE doctorant.id IS NULL; ", nativeQuery = true)
    List<Sujet> findAll1();

    @Query(value="SELECT * FROM laboratoire ORDER BY id DESC LIMIT 1;)", nativeQuery = true)
    Laboratoire  maxid();

    @Query(value="SELECT * FROM laboratoire   WHERE id IN (SELECT laboratoire_id FROM chef_lab )", nativeQuery = true)
    List<Laboratoire>  list();

}
