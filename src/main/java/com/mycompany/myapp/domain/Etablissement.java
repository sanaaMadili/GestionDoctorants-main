package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;

/**
 * A Etablissement.
 */
@Entity
@Table(name = "etablissement")
public class Etablissement implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "nom")
    private String nom;

    @Column(name = "ville")
    private String ville;

    @Column(name = "universite")
    private String universite;

    @Column(name = "addresse")
    private String addresse;

    @ManyToOne
    @JsonIgnoreProperties(value = { "formation", "doctorant", "etablissements" }, allowSetters = true)
    private FormationDoctorant formationDoctorant;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Etablissement id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return this.nom;
    }

    public Etablissement nom(String nom) {
        this.setNom(nom);
        return this;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getVille() {
        return this.ville;
    }

    public Etablissement ville(String ville) {
        this.setVille(ville);
        return this;
    }

    public void setVille(String ville) {
        this.ville = ville;
    }

    public String getUniversite() {
        return this.universite;
    }

    public Etablissement universite(String universite) {
        this.setUniversite(universite);
        return this;
    }

    public void setUniversite(String universite) {
        this.universite = universite;
    }

    public String getAddresse() {
        return this.addresse;
    }

    public Etablissement addresse(String addresse) {
        this.setAddresse(addresse);
        return this;
    }

    public void setAddresse(String addresse) {
        this.addresse = addresse;
    }

    public FormationDoctorant getFormationDoctorant() {
        return this.formationDoctorant;
    }

    public void setFormationDoctorant(FormationDoctorant formationDoctorant) {
        this.formationDoctorant = formationDoctorant;
    }

    public Etablissement formationDoctorant(FormationDoctorant formationDoctorant) {
        this.setFormationDoctorant(formationDoctorant);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Etablissement)) {
            return false;
        }
        return id != null && id.equals(((Etablissement) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Etablissement{" +
            "id=" + getId() +
            ", nom='" + getNom() + "'" +
            ", ville='" + getVille() + "'" +
            ", universite='" + getUniversite() + "'" +
            ", addresse='" + getAddresse() + "'" +
            "}";
    }
}
