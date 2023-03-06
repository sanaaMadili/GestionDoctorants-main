package com.mycompany.myapp.repository;

import com.mycompany.myapp.charts.CountPubByType;
import com.mycompany.myapp.charts.Dureepartheme;
import com.mycompany.myapp.domain.Doctorant;
import com.mycompany.myapp.domain.FormationSuivie;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data SQL repository for the FormationSuivie entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FormationSuivieRepository extends JpaRepository<FormationSuivie, Long> {

    List<FormationSuivie> findByDoctorant(Doctorant doctorant);

    @Query("select SUM(f.duree) from FormationSuivie f left join f.doctorant doc where doc.id=:id")
    float sumDuree(@Param("id") Long id);

    @Query("select new com.mycompany.myapp.charts.Dureepartheme(theme.thematique,sum(f.duree)) from FormationSuivie f inner join Doctorant doc on doc.id=f.doctorant  inner join FormationDoctoranle theme on theme.id=f.formationDoctoranle where doc.id=:id group by theme.thematique")
    List<Dureepartheme> Dureepartheme(@Param("id") Long id);


}
