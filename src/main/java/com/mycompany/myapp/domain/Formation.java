package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A Formation.
 */
@Entity
@Table(name = "formation")
public class Formation implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "nom")
    private String nom;

    @Column(name = "niveau")
    private Integer niveau;

    @Column(name = "nb_annee")
    private Integer nbAnnee;

    @Column(name = "rang")
    private Integer rang;

    @ManyToOne
    @JsonIgnoreProperties(value = { "doctorants", "formations" }, allowSetters = true)
    private Cursus cursus;

    @OneToMany(mappedBy = "formation")
    @JsonIgnoreProperties(value = { "formation", "doctorant", "etablissements" }, allowSetters = true)
    private Set<FormationDoctorant> formationDoctorants = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Formation id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return this.nom;
    }

    public Formation nom(String nom) {
        this.setNom(nom);
        return this;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public Integer getNiveau() {
        return this.niveau;
    }

    public Formation niveau(Integer niveau) {
        this.setNiveau(niveau);
        return this;
    }

    public void setNiveau(Integer niveau) {
        this.niveau = niveau;
    }

    public Integer getNbAnnee() {
        return this.nbAnnee;
    }

    public Formation nbAnnee(Integer nbAnnee) {
        this.setNbAnnee(nbAnnee);
        return this;
    }

    public void setNbAnnee(Integer nbAnnee) {
        this.nbAnnee = nbAnnee;
    }

    public Integer getRang() {
        return this.rang;
    }

    public Formation rang(Integer rang) {
        this.setRang(rang);
        return this;
    }

    public void setRang(Integer rang) {
        this.rang = rang;
    }

    public Cursus getCursus() {
        return this.cursus;
    }

    public void setCursus(Cursus cursus) {
        this.cursus = cursus;
    }

    public Formation cursus(Cursus cursus) {
        this.setCursus(cursus);
        return this;
    }

    public Set<FormationDoctorant> getFormationDoctorants() {
        return this.formationDoctorants;
    }

    public void setFormationDoctorants(Set<FormationDoctorant> formationDoctorants) {
        if (this.formationDoctorants != null) {
            this.formationDoctorants.forEach(i -> i.setFormation(null));
        }
        if (formationDoctorants != null) {
            formationDoctorants.forEach(i -> i.setFormation(this));
        }
        this.formationDoctorants = formationDoctorants;
    }

    public Formation formationDoctorants(Set<FormationDoctorant> formationDoctorants) {
        this.setFormationDoctorants(formationDoctorants);
        return this;
    }

    public Formation addFormationDoctorant(FormationDoctorant formationDoctorant) {
        this.formationDoctorants.add(formationDoctorant);
        formationDoctorant.setFormation(this);
        return this;
    }

    public Formation removeFormationDoctorant(FormationDoctorant formationDoctorant) {
        this.formationDoctorants.remove(formationDoctorant);
        formationDoctorant.setFormation(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Formation)) {
            return false;
        }
        return id != null && id.equals(((Formation) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Formation{" +
            "id=" + getId() +
            ", nom='" + getNom() + "'" +
            ", niveau=" + getNiveau() +
            ", nbAnnee=" + getNbAnnee() +
            ", rang=" + getRang() +
            "}";
    }
}
