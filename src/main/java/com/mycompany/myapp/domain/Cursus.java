package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A Cursus.
 */
@Entity
@Table(name = "cursus")
public class Cursus implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "nom")
    private String nom;

    @Column(name = "nb_formation")
    private Integer nbFormation;

    @OneToMany(mappedBy = "cursus")
    @JsonIgnoreProperties(
        value = { "sujet", "user", "promotion", "cursus", "formationDoctorants", "formationSuivies" },
        allowSetters = true
    )
    private Set<Doctorant> doctorants = new HashSet<>();

    @OneToMany(mappedBy = "cursus")
    @JsonIgnoreProperties(value = { "cursus", "formationDoctorants" }, allowSetters = true)
    private Set<Formation> formations = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Cursus id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return this.nom;
    }

    public Cursus nom(String nom) {
        this.setNom(nom);
        return this;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public Integer getNbFormation() {
        return this.nbFormation;
    }

    public Cursus nbFormation(Integer nbFormation) {
        this.setNbFormation(nbFormation);
        return this;
    }

    public void setNbFormation(Integer nbFormation) {
        this.nbFormation = nbFormation;
    }

    public Set<Doctorant> getDoctorants() {
        return this.doctorants;
    }

    public void setDoctorants(Set<Doctorant> doctorants) {
        if (this.doctorants != null) {
            this.doctorants.forEach(i -> i.setCursus(null));
        }
        if (doctorants != null) {
            doctorants.forEach(i -> i.setCursus(this));
        }
        this.doctorants = doctorants;
    }

    public Cursus doctorants(Set<Doctorant> doctorants) {
        this.setDoctorants(doctorants);
        return this;
    }

    public Cursus addDoctorant(Doctorant doctorant) {
        this.doctorants.add(doctorant);
        doctorant.setCursus(this);
        return this;
    }

    public Cursus removeDoctorant(Doctorant doctorant) {
        this.doctorants.remove(doctorant);
        doctorant.setCursus(null);
        return this;
    }

    public Set<Formation> getFormations() {
        return this.formations;
    }

    public void setFormations(Set<Formation> formations) {
        if (this.formations != null) {
            this.formations.forEach(i -> i.setCursus(null));
        }
        if (formations != null) {
            formations.forEach(i -> i.setCursus(this));
        }
        this.formations = formations;
    }

    public Cursus formations(Set<Formation> formations) {
        this.setFormations(formations);
        return this;
    }

    public Cursus addFormation(Formation formation) {
        this.formations.add(formation);
        formation.setCursus(this);
        return this;
    }

    public Cursus removeFormation(Formation formation) {
        this.formations.remove(formation);
        formation.setCursus(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Cursus)) {
            return false;
        }
        return id != null && id.equals(((Cursus) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Cursus{" +
            "id=" + getId() +
            ", nom='" + getNom() + "'" +
            ", nbFormation=" + getNbFormation() +
            "}";
    }
}
