package com.mycompany.myapp.repository;

import com.mycompany.myapp.charts.*;
import com.mycompany.myapp.domain.Publication;
import java.util.List;
import java.util.Optional;

import com.mycompany.myapp.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Publication entity.
 */
@Repository
public interface PublicationRepository extends PublicationRepositoryWithBagRelationships, JpaRepository<Publication, Long> {
    @Query("select publication from Publication publication where publication.user.login = ?#{principal.username}")
    List<Publication> findByUserIsCurrentUser();

    List<Publication> findPublicationByUserOrderByDate(User user);

    default Optional<Publication> findOneWithEagerRelationships(Long id) {
        return this.fetchBagRelationships(this.findOneWithToOneRelationships(id));
    }

    default List<Publication> findAllWithEagerRelationships() {
        return this.fetchBagRelationships(this.findAllWithToOneRelationships());
    }

    default Page<Publication> findAllWithEagerRelationships(Pageable pageable) {
        return this.fetchBagRelationships(this.findAllWithToOneRelationships(pageable));
    }

    @Query(
        value = "select distinct publication from Publication publication left join fetch publication.user",
        countQuery = "select count(distinct publication) from Publication publication"
    )
    Page<Publication> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct publication from Publication publication left join fetch publication.user")
    List<Publication> findAllWithToOneRelationships();

    @Query("select publication from Publication publication left join fetch publication.user where publication.id =:id")
    Optional<Publication> findOneWithToOneRelationships(@Param("id") Long id);

    @Query("select new com.mycompany.myapp.charts.CountPub( p.date, count(p.description)) from Publication p left join User user on p.user=user.id where p.user.login=:login GROUP BY p.date ORDER BY p.date")
    List<CountPub> countPublicationByUserOrderByDate(@Param("login") String login);

    @Query("select new com.mycompany.myapp.charts.CountPub( p.date, count(p.description)) from Publication p GROUP BY p.date ORDER BY p.date")
    List<CountPub> countPublicationOrderByDate();

    @Query("select new com.mycompany.myapp.charts.CountPubByType( p.type, count(p.description)) from Publication p left join User user on p.user=user.id where p.user.login=:login GROUP BY p.type ")
    List<CountPubByType> countPublicationByUserGroupbyType(@Param("login") String login);

    @Query("select new com.mycompany.myapp.charts.CountPubByType( p.type, count(p.description)) from Publication p GROUP BY p.type ")
    List<CountPubByType> countPublicationGroupbyType();

    @Query("select  p from Publication p inner JOIN p.chercheurs a where a.login=:id or p.user.login=:id")
    List<Publication> findPublicationByUserOrChercheurs(@Param("id") String id);

    @Query("select new com.mycompany.myapp.charts.CountPubBytypeAnnee( p.date, count(p.description),p.type)   from Publication p left join User user on p.user=user.id where p.user.login=:login GROUP BY p.date,p.type  ")
    List<CountPubBytypeAnnee> countPublicationByTypeGroupByDate(@Param("login") String login);

    @Query("select new com.mycompany.myapp.charts.CountPubBytypeAnnee( p.date, count(p.description),p.type)   from Publication p GROUP BY p.date,p.type  ")
    List<CountPubBytypeAnnee> countAllPublicationByTypeGroupByDate();

    @Query("select new com.mycompany.myapp.charts.CountPubByChercheurExterne( p.date, count(c.id)) from Publication p left join User user on p.user=user.id left join ChercheurExterne c on p.id=c.id where p.user.login=:login  GROUP BY p.date  ")
    List<CountPubByChercheurExterne> countPublicationGroupByChercheurExternes(@Param("login") String login);

    @Query("select new com.mycompany.myapp.charts.CountChercheurPays( c.pays,p.date, count(c.id)) from Publication p left join ChercheurExterne c on p.id=c.id   GROUP BY p.date,c.pays  ")
    List<CountChercheurPays> countPublicationGroupBypays();
    @Query("select distinct p.type from Publication p left join User user on p.user=user.id where p.user.login=:login")
    List<String> PublicationType(@Param("login") String login);

    @Query(value="select * from publication where user_id in (select internal_user_id from  extra_user where id=:login)", nativeQuery = true)
    List<Publication> publicationbyuser(@Param("login") String login);

    default List<Publication> findAllWithEagerRelationships33(String id) {
        return this.fetchBagRelationships(this.findPublicationByUserOrChercheurs(id));
    }

    default List<Publication> findAllWithEagerRelationships3() {
        return this.fetchBagRelationships(this.findByUserIsCurrentUser());
    }
    default List<Publication> findAllWithEagerRelationships4(User user) {
        return this.fetchBagRelationships(this.findPublicationByUserOrderByDate( user));
    }




}
