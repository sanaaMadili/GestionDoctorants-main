package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Doctorant;
import com.mycompany.myapp.domain.Equipe;
import java.util.List;
import java.util.Optional;

import com.mycompany.myapp.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Equipe entity.
 */
@Repository
public interface EquipeRepository extends JpaRepository<Equipe, Long> {
    default Optional<Equipe> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Equipe> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Equipe> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct equipe from Equipe equipe left join fetch equipe.laboratoire",
        countQuery = "select count(distinct equipe) from Equipe equipe"
    )
    Page<Equipe> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct equipe from Equipe equipe left join fetch equipe.laboratoire")
    List<Equipe> findAllWithToOneRelationships();
    @Query(value="SELECT * FROM equipe  WHERE laboratoire_id IN  (select laboratoire_id from chef_lab where extra_user_id IN (SELECT id FROM extra_user  WHERE internal_user_id =:id ))", nativeQuery = true)

    List<Equipe> cheflab(@Param("id") User id);
    @Query("select equipe from Equipe equipe left join fetch equipe.laboratoire where equipe.id =:id")
    Optional<Equipe> findOneWithToOneRelationships(@Param("id") Long id);

    @Query(value="SELECT * FROM equipe  WHERE id IN  (select equipe_id from chef_equipe where date_fin='0031-01-09' and extra_user_id IN (SELECT id FROM extra_user  WHERE internal_user_id =:id ))", nativeQuery = true)

    List<Equipe> chefequipe(@Param("id") User id);
}
