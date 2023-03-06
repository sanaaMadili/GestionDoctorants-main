package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Bourse;
import java.util.List;
import java.util.Optional;

import com.mycompany.myapp.domain.Doctorant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Bourse entity.
 */
@Repository
public interface BourseRepository extends JpaRepository<Bourse, Long> {
    default Optional<Bourse> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Bourse> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Bourse> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }


    @Query(
        value = "select distinct bourse from Bourse bourse left join fetch bourse.doctorant d left join fetch d.user ",
        countQuery = "select count(distinct bourse) from Bourse bourse"
    )
    Page<Bourse> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct bourse from Bourse bourse left join fetch bourse.doctorant d left join fetch d.user")
    List<Bourse> findAllWithToOneRelationships();

    @Query("select bourse from Bourse bourse left join fetch bourse.doctorant where bourse.id =:id")
    Optional<Bourse> findOneWithToOneRelationships(@Param("id") Long id);

    Bourse getByDoctorant(Doctorant doctorant);
}
