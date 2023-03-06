package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A Promotion.
 */
@Entity
@Table(name = "promotion")
public class Promotion implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "annee", nullable = false)
    private Integer annee;

    @Column(name = "nom")
    private String nom;

    @OneToMany(mappedBy = "promotion")
    @JsonIgnoreProperties(
        value = { "sujet", "user", "promotion", "cursus", "formationDoctorants", "formationSuivies" },
        allowSetters = true
    )
    private Set<Doctorant> doctorants = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Promotion id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getAnnee() {
        return this.annee;
    }

    public Promotion annee(Integer annee) {
        this.setAnnee(annee);
        return this;
    }

    public void setAnnee(Integer annee) {
        this.annee = annee;
    }

    public String getNom() {
        return this.nom;
    }

    public Promotion nom(String nom) {
        this.setNom(nom);
        return this;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public Set<Doctorant> getDoctorants() {
        return this.doctorants;
    }

    public void setDoctorants(Set<Doctorant> doctorants) {
        if (this.doctorants != null) {
            this.doctorants.forEach(i -> i.setPromotion(null));
        }
        if (doctorants != null) {
            doctorants.forEach(i -> i.setPromotion(this));
        }
        this.doctorants = doctorants;
    }

    public Promotion doctorants(Set<Doctorant> doctorants) {
        this.setDoctorants(doctorants);
        return this;
    }

    public Promotion addDoctorant(Doctorant doctorant) {
        this.doctorants.add(doctorant);
        doctorant.setPromotion(this);
        return this;
    }

    public Promotion removeDoctorant(Doctorant doctorant) {
        this.doctorants.remove(doctorant);
        doctorant.setPromotion(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Promotion)) {
            return false;
        }
        return id != null && id.equals(((Promotion) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Promotion{" +
            "id=" + getId() +
            ", annee=" + getAnnee() +
            ", nom='" + getNom() + "'" +
            "}";
    }
}
