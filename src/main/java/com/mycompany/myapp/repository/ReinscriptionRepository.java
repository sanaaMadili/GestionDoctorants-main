package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Reinscription;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data SQL repository for the Reinscription entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ReinscriptionRepository extends JpaRepository<Reinscription, Long> {
    @Query("select r from Reinscription r left join Doctorant doc on r.doctorant=doc.id where r.annee=:annee  and doc.id=:id")
    Reinscription reinscriptionscondition(@Param("annee") Double anne,@Param("id") Long id);

}
