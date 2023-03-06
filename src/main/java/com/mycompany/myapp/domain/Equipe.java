package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A Equipe.
 */
@Entity
@Table(name = "equipe")
public class Equipe implements Serializable {

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

    @ManyToOne
    @JsonIgnoreProperties(value = { "equipes" }, allowSetters = true)
    private Laboratoire laboratoire;

    @OneToMany(mappedBy = "equipe")
    @JsonIgnoreProperties(value = { "equipe", "extraUser" }, allowSetters = true)
    private Set<MembreEquipe> membreEquipes = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Equipe id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return this.nom;
    }

    public Equipe nom(String nom) {
        this.setNom(nom);
        return this;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getAbreviation() {
        return this.abreviation;
    }

    public Equipe abreviation(String abreviation) {
        this.setAbreviation(abreviation);
        return this;
    }

    public void setAbreviation(String abreviation) {
        this.abreviation = abreviation;
    }

    public Laboratoire getLaboratoire() {
        return this.laboratoire;
    }

    public void setLaboratoire(Laboratoire laboratoire) {
        this.laboratoire = laboratoire;
    }

    public Equipe laboratoire(Laboratoire laboratoire) {
        this.setLaboratoire(laboratoire);
        return this;
    }

    public Set<MembreEquipe> getMembreEquipes() {
        return this.membreEquipes;
    }

    public void setMembreEquipes(Set<MembreEquipe> membreEquipes) {
        if (this.membreEquipes != null) {
            this.membreEquipes.forEach(i -> i.setEquipe(null));
        }
        if (membreEquipes != null) {
            membreEquipes.forEach(i -> i.setEquipe(this));
        }
        this.membreEquipes = membreEquipes;
    }

    public Equipe membreEquipes(Set<MembreEquipe> membreEquipes) {
        this.setMembreEquipes(membreEquipes);
        return this;
    }

    public Equipe addMembreEquipe(MembreEquipe membreEquipe) {
        this.membreEquipes.add(membreEquipe);
        membreEquipe.setEquipe(this);
        return this;
    }

    public Equipe removeMembreEquipe(MembreEquipe membreEquipe) {
        this.membreEquipes.remove(membreEquipe);
        membreEquipe.setEquipe(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Equipe)) {
            return false;
        }
        return id != null && id.equals(((Equipe) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Equipe{" +
            "id=" + getId() +
            ", nom='" + getNom() + "'" +
            ", abreviation='" + getAbreviation() + "'" +
            "}";
    }
}
