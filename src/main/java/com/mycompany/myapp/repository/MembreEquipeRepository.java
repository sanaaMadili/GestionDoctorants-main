package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Equipe;
import com.mycompany.myapp.domain.MembreEquipe;
import com.mycompany.myapp.domain.User;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Spring Data SQL repository for the MembreEquipe entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MembreEquipeRepository extends JpaRepository<MembreEquipe, Long> {
    @Query(value="SELECT * FROM membre_equipe  WHERE equipe_id IN  (select id from equipe where id IN (SELECT equipe_id FROM chef_equipe WHERE   extra_user_id IN (SELECT id FROM extra_user  WHERE internal_user_id =:id) and date_fin='0031-01-09'))", nativeQuery = true)
    List<MembreEquipe> chefequipe(@Param("id") User id);
    @Modifying
    @Transactional
    @Query(value="UPDATE membre_equipe SET datefin=current_date WHERE extra_user_id=:id", nativeQuery = true)
    void  updatedate(@Param("id")  Long id);
}
