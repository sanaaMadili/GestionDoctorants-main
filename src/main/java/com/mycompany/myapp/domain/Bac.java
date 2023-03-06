package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;

/**
 * A Bac.
 */
@Entity
@Table(name = "bac")
public class Bac implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "serie_bac")
    private String serieBac;

    @Column(name = "type_bac")
    private String typeBac;

    @Column(name = "annee_obtention")
    private String anneeObtention;

    @Column(name = "note_bac")
    private Float noteBac;

    @Lob
    @Column(name = "scanne_bac")
    private byte[] scanneBac;

    @Column(name = "scanne_bac_content_type")
    private String scanneBacContentType;

    @Column(name = "mention")
    private String mention;

    @Column(name = "ville_obtention")
    private String villeObtention;

    @JsonIgnoreProperties(
        value = { "sujet", "user", "promotion", "cursus", "formationDoctorants", "formationSuivies" },
        allowSetters = true
    )
    @OneToOne
    @JoinColumn(unique = true)
    private Doctorant doctorant;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Bac id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSerieBac() {
        return this.serieBac;
    }

    public Bac serieBac(String serieBac) {
        this.setSerieBac(serieBac);
        return this;
    }

    public void setSerieBac(String serieBac) {
        this.serieBac = serieBac;
    }

    public String getTypeBac() {
        return this.typeBac;
    }

    public Bac typeBac(String typeBac) {
        this.setTypeBac(typeBac);
        return this;
    }

    public void setTypeBac(String typeBac) {
        this.typeBac = typeBac;
    }

    public String getAnneeObtention() {
        return this.anneeObtention;
    }

    public Bac anneeObtention(String anneeObtention) {
        this.setAnneeObtention(anneeObtention);
        return this;
    }

    public void setAnneeObtention(String anneeObtention) {
        this.anneeObtention = anneeObtention;
    }

    public Float getNoteBac() {
        return this.noteBac;
    }

    public Bac noteBac(Float noteBac) {
        this.setNoteBac(noteBac);
        return this;
    }

    public void setNoteBac(Float noteBac) {
        this.noteBac = noteBac;
    }

    public byte[] getScanneBac() {
        return this.scanneBac;
    }

    public Bac scanneBac(byte[] scanneBac) {
        this.setScanneBac(scanneBac);
        return this;
    }

    public void setScanneBac(byte[] scanneBac) {
        this.scanneBac = scanneBac;
    }

    public String getScanneBacContentType() {
        return this.scanneBacContentType;
    }

    public Bac scanneBacContentType(String scanneBacContentType) {
        this.scanneBacContentType = scanneBacContentType;
        return this;
    }

    public void setScanneBacContentType(String scanneBacContentType) {
        this.scanneBacContentType = scanneBacContentType;
    }

    public String getMention() {
        return this.mention;
    }

    public Bac mention(String mention) {
        this.setMention(mention);
        return this;
    }

    public void setMention(String mention) {
        this.mention = mention;
    }

    public String getVilleObtention() {
        return this.villeObtention;
    }

    public Bac villeObtention(String villeObtention) {
        this.setVilleObtention(villeObtention);
        return this;
    }

    public void setVilleObtention(String villeObtention) {
        this.villeObtention = villeObtention;
    }

    public Doctorant getDoctorant() {
        return this.doctorant;
    }

    public void setDoctorant(Doctorant doctorant) {
        this.doctorant = doctorant;
    }

    public Bac doctorant(Doctorant doctorant) {
        this.setDoctorant(doctorant);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Bac)) {
            return false;
        }
        return id != null && id.equals(((Bac) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Bac{" +
            "id=" + getId() +
            ", serieBac='" + getSerieBac() + "'" +
            ", typeBac='" + getTypeBac() + "'" +
            ", anneeObtention='" + getAnneeObtention() + "'" +
            ", noteBac=" + getNoteBac() +
            ", scanneBac='" + getScanneBac() + "'" +
            ", scanneBacContentType='" + getScanneBacContentType() + "'" +
            ", mention='" + getMention() + "'" +
            ", villeObtention='" + getVilleObtention() + "'" +
            "}";
    }
}
