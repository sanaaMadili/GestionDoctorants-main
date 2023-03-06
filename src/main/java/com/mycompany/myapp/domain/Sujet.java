package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A Sujet.
 */
@Entity
@Table(name = "sujet")
public class Sujet implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "titre", nullable = false)
    private String titre;

    @NotNull
    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "domaines")
    private String domaines;

    @Column(name = "mots_cles")
    private String motsCles;

    @Column(name = "context")
    private String context;

    @Column(name = "profil_recherchees")
    private String profilRecherchees;

    @NotNull
    @Column(name = "annee", nullable = false)
    private Integer annee;

    @Column(name = "reference")
    private String reference;

    @Column(name = "candidatures")
    private String candidatures;


    @ManyToOne
    @JsonIgnoreProperties(value = { "internalUser", "sujets", "membreEquipes" }, allowSetters = true)

    private ExtraUser coencadrent;
    @ManyToOne
    @JsonIgnoreProperties(value = { "internalUser", "sujets", "membreEquipes" }, allowSetters = true)
    private ExtraUser encadrent;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Sujet id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitre() {
        return this.titre;
    }

    public Sujet titre(String titre) {
        this.setTitre(titre);
        return this;
    }

    public void setTitre(String titre) {
        this.titre = titre;
    }

    public String getDescription() {
        return this.description;
    }

    public Sujet description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDomaines() {
        return this.domaines;
    }

    public Sujet domaines(String domaines) {
        this.setDomaines(domaines);
        return this;
    }

    public void setDomaines(String domaines) {
        this.domaines = domaines;
    }

    public String getMotsCles() {
        return this.motsCles;
    }

    public Sujet motsCles(String motsCles) {
        this.setMotsCles(motsCles);
        return this;
    }

    public void setMotsCles(String motsCles) {
        this.motsCles = motsCles;
    }

    public String getContext() {
        return this.context;
    }

    public Sujet context(String context) {
        this.setContext(context);
        return this;
    }

    public void setContext(String context) {
        this.context = context;
    }

    public String getProfilRecherchees() {
        return this.profilRecherchees;
    }

    public Sujet profilRecherchees(String profilRecherchees) {
        this.setProfilRecherchees(profilRecherchees);
        return this;
    }

    public void setProfilRecherchees(String profilRecherchees) {
        this.profilRecherchees = profilRecherchees;
    }

    public Integer getAnnee() {
        return this.annee;
    }

    public Sujet annee(Integer annee) {
        this.setAnnee(annee);
        return this;
    }

    public void setAnnee(Integer annee) {
        this.annee = annee;
    }

    public String getReference() {
        return this.reference;
    }

    public Sujet reference(String reference) {
        this.setReference(reference);
        return this;
    }

    public void setReference(String reference) {
        this.reference = reference;
    }

    public String getCandidatures() {
        return this.candidatures;
    }

    public Sujet candidatures(String candidatures) {
        this.setCandidatures(candidatures);
        return this;
    }

    public void setCandidatures(String candidatures) {
        this.candidatures = candidatures;
    }

    public ExtraUser getCoencadrent() {
        return this.coencadrent;
    }



    public void setCoencadrent(ExtraUser coencadrent) {
        this.coencadrent = coencadrent;
    }

    public ExtraUser getEncadrent() {
        return this.encadrent;
    }

    public void setEncadrent(ExtraUser extraUser) {
        this.encadrent = extraUser;
    }

    public Sujet encadrent(ExtraUser extraUser) {
        this.setEncadrent(extraUser);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Sujet)) {
            return false;
        }
        return id != null && id.equals(((Sujet) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Sujet{" +
            "id=" + getId() +
            ", titre='" + getTitre() + "'" +
            ", description='" + getDescription() + "'" +
            ", domaines='" + getDomaines() + "'" +
            ", motsCles='" + getMotsCles() + "'" +
            ", context='" + getContext() + "'" +
            ", profilRecherchees='" + getProfilRecherchees() + "'" +
            ", annee=" + getAnnee() +
            ", reference='" + getReference() + "'" +
            ", candidatures='" + getCandidatures() + "'" +
            ", coencadrent='" + getCoencadrent() + "'" +
            "}";
    }
}
