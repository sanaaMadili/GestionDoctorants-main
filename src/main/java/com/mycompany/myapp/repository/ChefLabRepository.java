package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.ChefLab;
import java.util.List;
import java.util.Optional;

import com.mycompany.myapp.domain.Laboratoire;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

/**
 * Spring Data SQL repository for the ChefLab entity.
 */
@Repository
public interface ChefLabRepository extends JpaRepository<ChefLab, Long> {
    default Optional<ChefLab> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<ChefLab> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<ChefLab> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct chefLab from ChefLab chefLab left join fetch chefLab.extraUser left join fetch chefLab.laboratoire",
        countQuery = "select count(distinct chefLab) from ChefLab chefLab"
    )
    Page<ChefLab> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct chefLab from ChefLab chefLab left join fetch chefLab.extraUser left join fetch chefLab.laboratoire")
    List<ChefLab> findAllWithToOneRelationships();

    @Query(
        "select chefLab from ChefLab chefLab left join fetch chefLab.extraUser left join fetch chefLab.laboratoire where chefLab.id =:id"
    )
    Optional<ChefLab> findOneWithToOneRelationships(@Param("id") Long id);

    @Query(value=" UPDATE chef_lab SET nom = 'nouveau_nom' WHERE id = 123", nativeQuery = true)
    List<Laboratoire>  list();
    @Modifying
    @Transactional
    @Query(value="UPDATE chef_lab SET date_fin=current_date WHERE laboratoire_id=:id", nativeQuery = true)
    void  updatedate(@Param("id")  Long id);
}
