package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;

/**
 * A Reinscription.
 */
@Entity
@Table(name = "reinscription")
public class Reinscription implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Lob
    @Column(name = "formulaire_reinscription")
    private byte[] formulaireReinscription;

    @Column(name = "formulaire_reinscription_content_type")
    private String formulaireReinscriptionContentType;

    @Lob
    @Column(name = "demande")
    private byte[] demande;

    @Column(name = "demande_content_type")
    private String demandeContentType;

    @Column(name = "annee")
    private Double annee;

    @ManyToOne
    @JsonIgnoreProperties(value = { "formationDoctorant" }, allowSetters = true)
    private Etablissement etablissement;

    @ManyToOne
    @JsonIgnoreProperties(
        value = { "sujet", "user", "promotion", "cursus", "formationDoctorants", "formationSuivies" },
        allowSetters = true
    )
    private Doctorant doctorant;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Reinscription id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public byte[] getFormulaireReinscription() {
        return this.formulaireReinscription;
    }

    public Reinscription formulaireReinscription(byte[] formulaireReinscription) {
        this.setFormulaireReinscription(formulaireReinscription);
        return this;
    }

    public void setFormulaireReinscription(byte[] formulaireReinscription) {
        this.formulaireReinscription = formulaireReinscription;
    }

    public String getFormulaireReinscriptionContentType() {
        return this.formulaireReinscriptionContentType;
    }

    public Reinscription formulaireReinscriptionContentType(String formulaireReinscriptionContentType) {
        this.formulaireReinscriptionContentType = formulaireReinscriptionContentType;
        return this;
    }

    public void setFormulaireReinscriptionContentType(String formulaireReinscriptionContentType) {
        this.formulaireReinscriptionContentType = formulaireReinscriptionContentType;
    }

    public byte[] getDemande() {
        return this.demande;
    }

    public Reinscription demande(byte[] demande) {
        this.setDemande(demande);
        return this;
    }

    public void setDemande(byte[] demande) {
        this.demande = demande;
    }

    public String getDemandeContentType() {
        return this.demandeContentType;
    }

    public Reinscription demandeContentType(String demandeContentType) {
        this.demandeContentType = demandeContentType;
        return this;
    }

    public void setDemandeContentType(String demandeContentType) {
        this.demandeContentType = demandeContentType;
    }

    public Double getAnnee() {
        return this.annee;
    }

    public Reinscription annee(Double annee) {
        this.setAnnee(annee);
        return this;
    }

    public void setAnnee(Double annee) {
        this.annee = annee;
    }

    public Etablissement getEtablissement() {
        return this.etablissement;
    }

    public void setEtablissement(Etablissement etablissement) {
        this.etablissement = etablissement;
    }

    public Reinscription etablissement(Etablissement etablissement) {
        this.setEtablissement(etablissement);
        return this;
    }

    public Doctorant getDoctorant() {
        return this.doctorant;
    }

    public void setDoctorant(Doctorant doctorant) {
        this.doctorant = doctorant;
    }

    public Reinscription doctorant(Doctorant doctorant) {
        this.setDoctorant(doctorant);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Reinscription)) {
            return false;
        }
        return id != null && id.equals(((Reinscription) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Reinscription{" +
            "id=" + getId() +
            ", formulaireReinscription='" + getFormulaireReinscription() + "'" +
            ", formulaireReinscriptionContentType='" + getFormulaireReinscriptionContentType() + "'" +
            ", demande='" + getDemande() + "'" +
            ", demandeContentType='" + getDemandeContentType() + "'" +
            ", annee=" + getAnnee() +
            "}";
    }
}
