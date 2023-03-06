package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.ExtraUser;
import com.mycompany.myapp.domain.User;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data SQL repository for the ExtraUser entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ExtraUserRepository extends JpaRepository<ExtraUser, Long> {
    ExtraUser getExtraUserByInternalUser(User user);
    @Query(value="SELECT * FROM extra_user  WHERE NOT EXISTS (select 1 from chef_lab where date_fin='0031-01-02' and extra_user.id=chef_lab.extra_user_id) and internal_user_id  IN (SELECT id FROM jhi_user  WHERE id IN (SELECT user_id FROM jhi_user_authority WHERE authority_name='ROLE_PROFESSEUR' ))", nativeQuery = true)
    List<ExtraUser> findExtraUsersWithAuthority();
}
