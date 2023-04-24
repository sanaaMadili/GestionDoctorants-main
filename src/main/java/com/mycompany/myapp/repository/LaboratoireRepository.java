package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.*;
import liquibase.pro.packaged.I;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
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
    @Query(value="SELECT * FROM laboratoire  WHERE id IN  (select laboratoire_id from chef_lab where extra_user_id IN (SELECT id FROM extra_user  WHERE internal_user_id =:id ))", nativeQuery = true)

    List<Laboratoire> labduprofesseur(@Param("id") User id);

}
