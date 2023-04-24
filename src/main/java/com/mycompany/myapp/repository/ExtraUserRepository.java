package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.ExtraUser;
import com.mycompany.myapp.domain.MembreEquipe;
import com.mycompany.myapp.domain.User;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data SQL repository for the ExtraUser entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ExtraUserRepository extends JpaRepository<ExtraUser, Long> {
    ExtraUser getExtraUserByInternalUser(User user);
    @Query(value="SELECT * FROM extra_user  WHERE NOT EXISTS (select 1 from chef_lab where date_fin='0031-01-09' and extra_user.id=chef_lab.extra_user_id)  and NOT EXISTS (select 1 from chef_equipe where date_fin='0031-01-09' and extra_user.id=chef_equipe.extra_user_id)   and internal_user_id  IN (SELECT id FROM jhi_user  WHERE id IN (SELECT user_id FROM jhi_user_authority WHERE authority_name='ROLE_PROFESSEUR' )) ", nativeQuery = true)
    List<ExtraUser> findExtraUsersWithAuthority();
    @Query(value="SELECT * FROM extra_user  WHERE id IN (SELECT extra_user_id FROM membre_equipe where equipe_id in (SELECT id FROM equipe  WHERE laboratoire_id IN  (select laboratoire_id from chef_lab where extra_user_id IN (SELECT id FROM extra_user  WHERE internal_user_id =:id )) )) ", nativeQuery = true)
    List<ExtraUser> extrauser(@Param("id") User id);
    @Query(value="SELECT * FROM extra_user  WHERE id IN (SELECT extra_user_id FROM membre_equipe where equipe_id in (SELECT id FROM equipe  WHERE laboratoire_id IN  (select laboratoire_id from chef_lab where extra_user_id IN (SELECT id FROM extra_user  WHERE internal_user_id =:id )) )) ", nativeQuery = true)
    List<ExtraUser> extrausermembre(@Param("id") User id);


}
