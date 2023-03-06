package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Doctorant;
import com.mycompany.myapp.domain.Formation;
import com.mycompany.myapp.domain.FormationDoctorant;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data SQL repository for the FormationDoctorant entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FormationDoctorantRepository extends JpaRepository<FormationDoctorant, Long> {


    List<FormationDoctorant> getByFormationAndDoctorant(Formation formation, Doctorant doctorant);
    List<FormationDoctorant> getByDoctorant(Doctorant doctorant);

}
