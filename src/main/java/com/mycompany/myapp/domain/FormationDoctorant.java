package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A FormationDoctorant.
 */
@Entity
@Table(name = "formation_doctorant")
public class FormationDoctorant implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "specialite")
    private String specialite;

    @Column(name = "type")
    private String type;

    @Column(name = "date_obtention")
    private String dateObtention;

    @Column(name = "note_1")
    private Float note1;

    @Lob
    @Column(name = "scanne_note_1")
    private byte[] scanneNote1;

    @Column(name = "scanne_note_1_content_type")
    private String scanneNote1ContentType;

    @Column(name = "note_2")
    private Float note2;

    @Lob
    @Column(name = "scanne_note_2")
    private byte[] scanneNote2;

    @Column(name = "scanne_note_2_content_type")
    private String scanneNote2ContentType;

    @Column(name = "note_3")
    private Float note3;

    @Lob
    @Column(name = "scanne_note_3")
    private byte[] scanneNote3;

    @Column(name = "scanne_note_3_content_type")
    private String scanneNote3ContentType;

    @Column(name = "note_4")
    private Float note4;

    @Lob
    @Column(name = "scanne_note_4")
    private byte[] scanneNote4;

    @Column(name = "scanne_note_4_content_type")
    private String scanneNote4ContentType;

    @Column(name = "note_5")
    private Float note5;

    @Lob
    @Column(name = "scanne_note_5")
    private byte[] scanneNote5;

    @Column(name = "scanne_note_5_content_type")
    private String scanneNote5ContentType;

    @Lob
    @Column(name = "scanne_diplome")
    private byte[] scanneDiplome;

    @Column(name = "scanne_diplome_content_type")
    private String scanneDiplomeContentType;

    @Column(name = "mention")
    private String mention;

    @ManyToOne
    @JsonIgnoreProperties(value = { "cursus", "formationDoctorants" }, allowSetters = true)
    private Formation formation;

    @ManyToOne
    @JsonIgnoreProperties(
        value = { "sujet", "user", "promotion", "cursus", "formationDoctorants", "formationSuivies" },
        allowSetters = true
    )
    private Doctorant doctorant;

    @OneToMany(mappedBy = "formationDoctorant")
    @JsonIgnoreProperties(value = { "formationDoctorant" }, allowSetters = true)
    private Set<Etablissement> etablissements = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public FormationDoctorant id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSpecialite() {
        return this.specialite;
    }

    public FormationDoctorant specialite(String specialite) {
        this.setSpecialite(specialite);
        return this;
    }

    public void setSpecialite(String specialite) {
        this.specialite = specialite;
    }

    public String getType() {
        return this.type;
    }

    public FormationDoctorant type(String type) {
        this.setType(type);
        return this;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getDateObtention() {
        return this.dateObtention;
    }

    public FormationDoctorant dateObtention(String dateObtention) {
        this.setDateObtention(dateObtention);
        return this;
    }

    public void setDateObtention(String dateObtention) {
        this.dateObtention = dateObtention;
    }

    public Float getNote1() {
        return this.note1;
    }

    public FormationDoctorant note1(Float note1) {
        this.setNote1(note1);
        return this;
    }

    public void setNote1(Float note1) {
        this.note1 = note1;
    }

    public byte[] getScanneNote1() {
        return this.scanneNote1;
    }

    public FormationDoctorant scanneNote1(byte[] scanneNote1) {
        this.setScanneNote1(scanneNote1);
        return this;
    }

    public void setScanneNote1(byte[] scanneNote1) {
        this.scanneNote1 = scanneNote1;
    }

    public String getScanneNote1ContentType() {
        return this.scanneNote1ContentType;
    }

    public FormationDoctorant scanneNote1ContentType(String scanneNote1ContentType) {
        this.scanneNote1ContentType = scanneNote1ContentType;
        return this;
    }

    public void setScanneNote1ContentType(String scanneNote1ContentType) {
        this.scanneNote1ContentType = scanneNote1ContentType;
    }

    public Float getNote2() {
        return this.note2;
    }

    public FormationDoctorant note2(Float note2) {
        this.setNote2(note2);
        return this;
    }

    public void setNote2(Float note2) {
        this.note2 = note2;
    }

    public byte[] getScanneNote2() {
        return this.scanneNote2;
    }

    public FormationDoctorant scanneNote2(byte[] scanneNote2) {
        this.setScanneNote2(scanneNote2);
        return this;
    }

    public void setScanneNote2(byte[] scanneNote2) {
        this.scanneNote2 = scanneNote2;
    }

    public String getScanneNote2ContentType() {
        return this.scanneNote2ContentType;
    }

    public FormationDoctorant scanneNote2ContentType(String scanneNote2ContentType) {
        this.scanneNote2ContentType = scanneNote2ContentType;
        return this;
    }

    public void setScanneNote2ContentType(String scanneNote2ContentType) {
        this.scanneNote2ContentType = scanneNote2ContentType;
    }

    public Float getNote3() {
        return this.note3;
    }

    public FormationDoctorant note3(Float note3) {
        this.setNote3(note3);
        return this;
    }

    public void setNote3(Float note3) {
        this.note3 = note3;
    }

    public byte[] getScanneNote3() {
        return this.scanneNote3;
    }

    public FormationDoctorant scanneNote3(byte[] scanneNote3) {
        this.setScanneNote3(scanneNote3);
        return this;
    }

    public void setScanneNote3(byte[] scanneNote3) {
        this.scanneNote3 = scanneNote3;
    }

    public String getScanneNote3ContentType() {
        return this.scanneNote3ContentType;
    }

    public FormationDoctorant scanneNote3ContentType(String scanneNote3ContentType) {
        this.scanneNote3ContentType = scanneNote3ContentType;
        return this;
    }

    public void setScanneNote3ContentType(String scanneNote3ContentType) {
        this.scanneNote3ContentType = scanneNote3ContentType;
    }

    public Float getNote4() {
        return this.note4;
    }

    public FormationDoctorant note4(Float note4) {
        this.setNote4(note4);
        return this;
    }

    public void setNote4(Float note4) {
        this.note4 = note4;
    }

    public byte[] getScanneNote4() {
        return this.scanneNote4;
    }

    public FormationDoctorant scanneNote4(byte[] scanneNote4) {
        this.setScanneNote4(scanneNote4);
        return this;
    }

    public void setScanneNote4(byte[] scanneNote4) {
        this.scanneNote4 = scanneNote4;
    }

    public String getScanneNote4ContentType() {
        return this.scanneNote4ContentType;
    }

    public FormationDoctorant scanneNote4ContentType(String scanneNote4ContentType) {
        this.scanneNote4ContentType = scanneNote4ContentType;
        return this;
    }

    public void setScanneNote4ContentType(String scanneNote4ContentType) {
        this.scanneNote4ContentType = scanneNote4ContentType;
    }

    public Float getNote5() {
        return this.note5;
    }

    public FormationDoctorant note5(Float note5) {
        this.setNote5(note5);
        return this;
    }

    public void setNote5(Float note5) {
        this.note5 = note5;
    }

    public byte[] getScanneNote5() {
        return this.scanneNote5;
    }

    public FormationDoctorant scanneNote5(byte[] scanneNote5) {
        this.setScanneNote5(scanneNote5);
        return this;
    }

    public void setScanneNote5(byte[] scanneNote5) {
        this.scanneNote5 = scanneNote5;
    }

    public String getScanneNote5ContentType() {
        return this.scanneNote5ContentType;
    }

    public FormationDoctorant scanneNote5ContentType(String scanneNote5ContentType) {
        this.scanneNote5ContentType = scanneNote5ContentType;
        return this;
    }

    public void setScanneNote5ContentType(String scanneNote5ContentType) {
        this.scanneNote5ContentType = scanneNote5ContentType;
    }

    public byte[] getScanneDiplome() {
        return this.scanneDiplome;
    }

    public FormationDoctorant scanneDiplome(byte[] scanneDiplome) {
        this.setScanneDiplome(scanneDiplome);
        return this;
    }

    public void setScanneDiplome(byte[] scanneDiplome) {
        this.scanneDiplome = scanneDiplome;
    }

    public String getScanneDiplomeContentType() {
        return this.scanneDiplomeContentType;
    }

    public FormationDoctorant scanneDiplomeContentType(String scanneDiplomeContentType) {
        this.scanneDiplomeContentType = scanneDiplomeContentType;
        return this;
    }

    public void setScanneDiplomeContentType(String scanneDiplomeContentType) {
        this.scanneDiplomeContentType = scanneDiplomeContentType;
    }

    public String getMention() {
        return this.mention;
    }

    public FormationDoctorant mention(String mention) {
        this.setMention(mention);
        return this;
    }

    public void setMention(String mention) {
        this.mention = mention;
    }

    public Formation getFormation() {
        return this.formation;
    }

    public void setFormation(Formation formation) {
        this.formation = formation;
    }

    public FormationDoctorant formation(Formation formation) {
        this.setFormation(formation);
        return this;
    }

    public Doctorant getDoctorant() {
        return this.doctorant;
    }

    public void setDoctorant(Doctorant doctorant) {
        this.doctorant = doctorant;
    }

    public FormationDoctorant doctorant(Doctorant doctorant) {
        this.setDoctorant(doctorant);
        return this;
    }

    public Set<Etablissement> getEtablissements() {
        return this.etablissements;
    }

    public void setEtablissements(Set<Etablissement> etablissements) {
        if (this.etablissements != null) {
            this.etablissements.forEach(i -> i.setFormationDoctorant(null));
        }
        if (etablissements != null) {
            etablissements.forEach(i -> i.setFormationDoctorant(this));
        }
        this.etablissements = etablissements;
    }

    public FormationDoctorant etablissements(Set<Etablissement> etablissements) {
        this.setEtablissements(etablissements);
        return this;
    }

    public FormationDoctorant addEtablissement(Etablissement etablissement) {
        this.etablissements.add(etablissement);
        etablissement.setFormationDoctorant(this);
        return this;
    }

    public FormationDoctorant removeEtablissement(Etablissement etablissement) {
        this.etablissements.remove(etablissement);
        etablissement.setFormationDoctorant(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof FormationDoctorant)) {
            return false;
        }
        return id != null && id.equals(((FormationDoctorant) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "FormationDoctorant{" +
            "id=" + getId() +
            ", specialite='" + getSpecialite() + "'" +
            ", type='" + getType() + "'" +
            ", dateObtention='" + getDateObtention() + "'" +
            ", note1=" + getNote1() +
            ", scanneNote1='" + getScanneNote1() + "'" +
            ", scanneNote1ContentType='" + getScanneNote1ContentType() + "'" +
            ", note2=" + getNote2() +
            ", scanneNote2='" + getScanneNote2() + "'" +
            ", scanneNote2ContentType='" + getScanneNote2ContentType() + "'" +
            ", note3=" + getNote3() +
            ", scanneNote3='" + getScanneNote3() + "'" +
            ", scanneNote3ContentType='" + getScanneNote3ContentType() + "'" +
            ", note4=" + getNote4() +
            ", scanneNote4='" + getScanneNote4() + "'" +
            ", scanneNote4ContentType='" + getScanneNote4ContentType() + "'" +
            ", note5=" + getNote5() +
            ", scanneNote5='" + getScanneNote5() + "'" +
            ", scanneNote5ContentType='" + getScanneNote5ContentType() + "'" +
            ", scanneDiplome='" + getScanneDiplome() + "'" +
            ", scanneDiplomeContentType='" + getScanneDiplomeContentType() + "'" +
            ", mention='" + getMention() + "'" +
            "}";
    }
}
