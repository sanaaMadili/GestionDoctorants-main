package com.mycompany.myapp.repository;

import com.mycompany.myapp.charts.CountDoc;
import com.mycompany.myapp.charts.DoctorantCountSalariee;
import com.mycompany.myapp.domain.Doctorant;
import java.util.List;
import java.util.Optional;

import com.mycompany.myapp.domain.Publication;
import com.mycompany.myapp.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

/**
 * Spring Data SQL repository for the Doctorant entity.
 */
@Repository
public interface DoctorantRepository extends JpaRepository<Doctorant, Long> {
    default Optional<Doctorant> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }
    Doctorant getByUser(User user);

    default List<Doctorant> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Doctorant> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct doctorant from Doctorant doctorant left join fetch doctorant.sujet s left join fetch s.encadrent left join fetch doctorant.promotion",
        countQuery = "select count(distinct doctorant) from Doctorant doctorant"
    )
    Page<Doctorant> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct doctorant from Doctorant doctorant left join fetch doctorant.sujet left join fetch doctorant.promotion")
    List<Doctorant> findAllWithToOneRelationships();

    @Query(
        "select doctorant from Doctorant doctorant left join fetch doctorant.sujet left join fetch doctorant.promotion where doctorant.id =:id"
    )
    Optional<Doctorant> findOneWithToOneRelationships(@Param("id") Long id);

    @Query(
        "select  new com.mycompany.myapp.charts.DoctorantCountSalariee(doctorant.etatProfessionnel,doctorant.anneeInscription ,count(doctorant)) from Doctorant doctorant where doctorant.anneeInscription IS NOT NULL GROUP BY doctorant.etatProfessionnel ,doctorant.anneeInscription  "
    )
    List<DoctorantCountSalariee> CountEtatProf();

    @Query(
        "select  new com.mycompany.myapp.charts.CountDoc(doctorant.anneeInscription ,count(doctorant)) from Doctorant doctorant where doctorant.anneeInscription IS NOT NULL  GROUP BY doctorant.anneeInscription  "
    )
    List<CountDoc> countDoctorantGroupByAnneeInscription();

    @Query(
        "select doctorant  from Doctorant doctorant left join fetch doctorant.sujet s left join fetch s.encadrent  where doctorant.sujet.encadrent.internalUser=:id   "
    )
    List<Doctorant> prof(@Param("id") User id);

    @Modifying
    @Transactional
    @Query("update Doctorant doc set doc.etatDossier = 0 where doc.id>0 and doc.etatDossier!=3")
    void reinscription();
    @Query(value="select * from doctorant where sujet_id in (select id from  sujet where encadrent_id in (select id from  extra_user where id=:id))", nativeQuery = true)
    List<Doctorant> doctorantbymembre(@Param("id") long id);
}
