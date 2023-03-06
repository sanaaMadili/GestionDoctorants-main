package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.ChefEquipe;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the ChefEquipe entity.
 */
@Repository
public interface ChefEquipeRepository extends JpaRepository<ChefEquipe, Long> {
    default Optional<ChefEquipe> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<ChefEquipe> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<ChefEquipe> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct chefEquipe from ChefEquipe chefEquipe left join fetch chefEquipe.extraUser left join fetch chefEquipe.equipe",
        countQuery = "select count(distinct chefEquipe) from ChefEquipe chefEquipe"
    )
    Page<ChefEquipe> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct chefEquipe from ChefEquipe chefEquipe left join fetch chefEquipe.extraUser left join fetch chefEquipe.equipe")
    List<ChefEquipe> findAllWithToOneRelationships();

    @Query(
        "select chefEquipe from ChefEquipe chefEquipe left join fetch chefEquipe.extraUser left join fetch chefEquipe.equipe where chefEquipe.id =:id"
    )
    Optional<ChefEquipe> findOneWithToOneRelationships(@Param("id") Long id);
}
