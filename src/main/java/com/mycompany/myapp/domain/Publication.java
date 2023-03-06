package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A Publication.
 */
@Entity
@Table(name = "publication")
public class Publication implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "titre", nullable = false)
    private String titre;

    @NotNull
    @Column(name = "date", nullable = false)
    private Integer date;

    @NotNull
    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "type")
    private String type;

    @Lob
    @Column(name = "article")
    private byte[] article;

    @Column(name = "article_content_type")
    private String articleContentType;

    @ManyToMany
    @JoinTable(
        name = "rel_publication__chercheur",
        joinColumns = @JoinColumn(name = "publication_id"),
        inverseJoinColumns = @JoinColumn(name = "chercheur_id")
    )
    private Set<User> chercheurs = new HashSet<>();

    @ManyToMany
    @JoinTable(
        name = "rel_publication__chercheur_externe",
        joinColumns = @JoinColumn(name = "publication_id"),
        inverseJoinColumns = @JoinColumn(name = "chercheur_externe_id")
    )
    @JsonIgnoreProperties(value = { "user" }, allowSetters = true)
    private Set<ChercheurExterne> chercheurExternes = new HashSet<>();

    @ManyToOne
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Publication id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitre() {
        return this.titre;
    }

    public Publication titre(String titre) {
        this.setTitre(titre);
        return this;
    }

    public void setTitre(String titre) {
        this.titre = titre;
    }

    public Integer getDate() {
        return this.date;
    }

    public Publication date(Integer date) {
        this.setDate(date);
        return this;
    }

    public void setDate(Integer date) {
        this.date = date;
    }

    public String getDescription() {
        return this.description;
    }

    public Publication description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getType() {
        return this.type;
    }

    public Publication type(String type) {
        this.setType(type);
        return this;
    }

    public void setType(String type) {
        this.type = type;
    }

    public byte[] getArticle() {
        return this.article;
    }

    public Publication article(byte[] article) {
        this.setArticle(article);
        return this;
    }

    public void setArticle(byte[] article) {
        this.article = article;
    }

    public String getArticleContentType() {
        return this.articleContentType;
    }

    public Publication articleContentType(String articleContentType) {
        this.articleContentType = articleContentType;
        return this;
    }

    public void setArticleContentType(String articleContentType) {
        this.articleContentType = articleContentType;
    }

    public Set<User> getChercheurs() {
        return this.chercheurs;
    }

    public void setChercheurs(Set<User> users) {
        this.chercheurs = users;
    }

    public Publication chercheurs(Set<User> users) {
        this.setChercheurs(users);
        return this;
    }

    public Publication addChercheur(User user) {
        this.chercheurs.add(user);
        return this;
    }

    public Publication removeChercheur(User user) {
        this.chercheurs.remove(user);
        return this;
    }

    public Set<ChercheurExterne> getChercheurExternes() {
        return this.chercheurExternes;
    }

    public void setChercheurExternes(Set<ChercheurExterne> chercheurExternes) {
        this.chercheurExternes = chercheurExternes;
    }

    public Publication chercheurExternes(Set<ChercheurExterne> chercheurExternes) {
        this.setChercheurExternes(chercheurExternes);
        return this;
    }

    public Publication addChercheurExterne(ChercheurExterne chercheurExterne) {
        this.chercheurExternes.add(chercheurExterne);
        return this;
    }

    public Publication removeChercheurExterne(ChercheurExterne chercheurExterne) {
        this.chercheurExternes.remove(chercheurExterne);
        return this;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Publication user(User user) {
        this.setUser(user);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Publication)) {
            return false;
        }
        return id != null && id.equals(((Publication) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Publication{" +
            "id=" + getId() +
            ", titre='" + getTitre() + "'" +
            ", date=" + getDate() +
            ", description='" + getDescription() + "'" +
            ", type='" + getType() + "'" +
            ", article='" + getArticle() + "'" +
            ", articleContentType='" + getArticleContentType() + "'" +
            "}";
    }
}
