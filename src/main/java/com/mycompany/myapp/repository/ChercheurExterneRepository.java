package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.ChercheurExterne;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the ChercheurExterne entity.
 */
@Repository
public interface ChercheurExterneRepository extends JpaRepository<ChercheurExterne, Long> {
    @Query("select chercheurExterne from ChercheurExterne chercheurExterne where chercheurExterne.user.login = ?#{principal.username}")
    List<ChercheurExterne> findByUserIsCurrentUser();

    default Optional<ChercheurExterne> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<ChercheurExterne> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<ChercheurExterne> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct chercheurExterne from ChercheurExterne chercheurExterne left join fetch chercheurExterne.user",
        countQuery = "select count(distinct chercheurExterne) from ChercheurExterne chercheurExterne"
    )
    Page<ChercheurExterne> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct chercheurExterne from ChercheurExterne chercheurExterne left join fetch chercheurExterne.user")
    List<ChercheurExterne> findAllWithToOneRelationships();

    @Query(
        "select chercheurExterne from ChercheurExterne chercheurExterne left join fetch chercheurExterne.user where chercheurExterne.id =:id"
    )
    Optional<ChercheurExterne> findOneWithToOneRelationships(@Param("id") Long id);
}
