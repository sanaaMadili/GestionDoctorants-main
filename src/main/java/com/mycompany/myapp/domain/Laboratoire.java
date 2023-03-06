package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A Laboratoire.
 */
@Entity
@Table(name = "laboratoire")
public class Laboratoire implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "nom", nullable = false)
    private String nom;

    @NotNull
    @Column(name = "abreviation", nullable = false)
    private String abreviation;

    @OneToMany(mappedBy = "laboratoire")
    @JsonIgnoreProperties(value = { "laboratoire", "membreEquipes" }, allowSetters = true)
    private Set<Equipe> equipes = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Laboratoire id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return this.nom;
    }

    public Laboratoire nom(String nom) {
        this.setNom(nom);
        return this;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getAbreviation() {
        return this.abreviation;
    }

    public Laboratoire abreviation(String abreviation) {
        this.setAbreviation(abreviation);
        return this;
    }

    public void setAbreviation(String abreviation) {
        this.abreviation = abreviation;
    }

    public Set<Equipe> getEquipes() {
        return this.equipes;
    }

    public void setEquipes(Set<Equipe> equipes) {
        if (this.equipes != null) {
            this.equipes.forEach(i -> i.setLaboratoire(null));
        }
        if (equipes != null) {
            equipes.forEach(i -> i.setLaboratoire(this));
        }
        this.equipes = equipes;
    }

    public Laboratoire equipes(Set<Equipe> equipes) {
        this.setEquipes(equipes);
        return this;
    }

    public Laboratoire addEquipe(Equipe equipe) {
        this.equipes.add(equipe);
        equipe.setLaboratoire(this);
        return this;
    }

    public Laboratoire removeEquipe(Equipe equipe) {
        this.equipes.remove(equipe);
        equipe.setLaboratoire(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Laboratoire)) {
            return false;
        }
        return id != null && id.equals(((Laboratoire) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Laboratoire{" +
            "id=" + getId() +
            ", nom='" + getNom() + "'" +
            ", abreviation='" + getAbreviation() + "'" +
            "}";
    }
}
