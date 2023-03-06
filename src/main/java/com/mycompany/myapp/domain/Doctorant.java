package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A Doctorant.
 */
@Entity
@Table(name = "doctorant")
public class Doctorant implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "cne", nullable = false)
    private String cne;

    @NotNull
    @Min(value = 0)
    @Max(value = 3)
    @Column(name = "etat_professionnel", nullable = false)
    private Integer etatProfessionnel;

    @Lob
    @Column(name = "photo_cne_pile")
    private byte[] photoCNEPile;

    @Column(name = "photo_cne_pile_content_type")
    private String photoCNEPileContentType;

    @Lob
    @Column(name = "photo_cne_face")
    private byte[] photoCNEFace;

    @Column(name = "photo_cne_face_content_type")
    private String photoCNEFaceContentType;

    @Lob
    @Column(name = "photo_cv")
    private byte[] photoCv;

    @Column(name = "photo_cv_content_type")
    private String photoCvContentType;

    @Column(name = "annee_inscription")
    private Integer anneeInscription;

    @Column(name = "etat_dossier")
    private Integer etatDossier;

    @NotNull
    @Column(name = "cin", nullable = false)
    private String cin;

    @NotNull
    @Column(name = "date_naissance", nullable = false)
    private Instant dateNaissance;

    @NotNull
    @Column(name = "lieu_naissance", nullable = false)
    private String lieuNaissance;

    @NotNull
    @Column(name = "nationalite", nullable = false)
    private String nationalite;

    @NotNull
    @Column(name = "adresse", nullable = false)
    private String adresse;

    @NotNull
    @Column(name = "numero_telephone", nullable = false)
    private Integer numeroTelephone;

    @NotNull
    @Column(name = "genre", nullable = false)
    private String genre;

    @NotNull
    @Column(name = "nom_arabe", nullable = false)
    private String nomArabe;

    @NotNull
    @Column(name = "prnom_arabe", nullable = false)
    private String prnomArabe;

    @JsonIgnoreProperties(value = { "encadrent" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Sujet sujet;

    @OneToOne
    @JoinColumn(unique = true)
    private User user;

    @ManyToOne
    @JsonIgnoreProperties(value = { "doctorants" }, allowSetters = true)
    private Promotion promotion;

    @ManyToOne
    @JsonIgnoreProperties(value = { "doctorants", "formations" }, allowSetters = true)
    private Cursus cursus;

    @OneToMany(mappedBy = "doctorant")
    @JsonIgnoreProperties(value = { "formation", "doctorant", "etablissements" }, allowSetters = true)
    private Set<FormationDoctorant> formationDoctorants = new HashSet<>();

    @OneToMany(mappedBy = "doctorant")
    @JsonIgnoreProperties(value = { "formationDoctoranle", "doctorant" }, allowSetters = true)
    private Set<FormationSuivie> formationSuivies = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Doctorant id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCne() {
        return this.cne;
    }

    public Doctorant cne(String cne) {
        this.setCne(cne);
        return this;
    }

    public void setCne(String cne) {
        this.cne = cne;
    }

    public Integer getEtatProfessionnel() {
        return this.etatProfessionnel;
    }

    public Doctorant etatProfessionnel(Integer etatProfessionnel) {
        this.setEtatProfessionnel(etatProfessionnel);
        return this;
    }

    public void setEtatProfessionnel(Integer etatProfessionnel) {
        this.etatProfessionnel = etatProfessionnel;
    }

    public byte[] getPhotoCNEPile() {
        return this.photoCNEPile;
    }

    public Doctorant photoCNEPile(byte[] photoCNEPile) {
        this.setPhotoCNEPile(photoCNEPile);
        return this;
    }

    public void setPhotoCNEPile(byte[] photoCNEPile) {
        this.photoCNEPile = photoCNEPile;
    }

    public String getPhotoCNEPileContentType() {
        return this.photoCNEPileContentType;
    }

    public Doctorant photoCNEPileContentType(String photoCNEPileContentType) {
        this.photoCNEPileContentType = photoCNEPileContentType;
        return this;
    }

    public void setPhotoCNEPileContentType(String photoCNEPileContentType) {
        this.photoCNEPileContentType = photoCNEPileContentType;
    }

    public byte[] getPhotoCNEFace() {
        return this.photoCNEFace;
    }

    public Doctorant photoCNEFace(byte[] photoCNEFace) {
        this.setPhotoCNEFace(photoCNEFace);
        return this;
    }

    public void setPhotoCNEFace(byte[] photoCNEFace) {
        this.photoCNEFace = photoCNEFace;
    }

    public String getPhotoCNEFaceContentType() {
        return this.photoCNEFaceContentType;
    }

    public Doctorant photoCNEFaceContentType(String photoCNEFaceContentType) {
        this.photoCNEFaceContentType = photoCNEFaceContentType;
        return this;
    }

    public void setPhotoCNEFaceContentType(String photoCNEFaceContentType) {
        this.photoCNEFaceContentType = photoCNEFaceContentType;
    }

    public byte[] getPhotoCv() {
        return this.photoCv;
    }

    public Doctorant photoCv(byte[] photoCv) {
        this.setPhotoCv(photoCv);
        return this;
    }

    public void setPhotoCv(byte[] photoCv) {
        this.photoCv = photoCv;
    }

    public String getPhotoCvContentType() {
        return this.photoCvContentType;
    }

    public Doctorant photoCvContentType(String photoCvContentType) {
        this.photoCvContentType = photoCvContentType;
        return this;
    }

    public void setPhotoCvContentType(String photoCvContentType) {
        this.photoCvContentType = photoCvContentType;
    }

    public Integer getAnneeInscription() {
        return this.anneeInscription;
    }

    public Doctorant anneeInscription(Integer anneeInscription) {
        this.setAnneeInscription(anneeInscription);
        return this;
    }

    public void setAnneeInscription(Integer anneeInscription) {
        this.anneeInscription = anneeInscription;
    }

    public Integer getEtatDossier() {
        return this.etatDossier;
    }

    public Doctorant etatDossier(Integer etatDossier) {
        this.setEtatDossier(etatDossier);
        return this;
    }

    public void setEtatDossier(Integer etatDossier) {
        this.etatDossier = etatDossier;
    }

    public String getCin() {
        return this.cin;
    }

    public Doctorant cin(String cin) {
        this.setCin(cin);
        return this;
    }

    public void setCin(String cin) {
        this.cin = cin;
    }

    public Instant getDateNaissance() {
        return this.dateNaissance;
    }

    public Doctorant dateNaissance(Instant dateNaissance) {
        this.setDateNaissance(dateNaissance);
        return this;
    }

    public void setDateNaissance(Instant dateNaissance) {
        this.dateNaissance = dateNaissance;
    }

    public String getLieuNaissance() {
        return this.lieuNaissance;
    }

    public Doctorant lieuNaissance(String lieuNaissance) {
        this.setLieuNaissance(lieuNaissance);
        return this;
    }

    public void setLieuNaissance(String lieuNaissance) {
        this.lieuNaissance = lieuNaissance;
    }

    public String getNationalite() {
        return this.nationalite;
    }

    public Doctorant nationalite(String nationalite) {
        this.setNationalite(nationalite);
        return this;
    }

    public void setNationalite(String nationalite) {
        this.nationalite = nationalite;
    }

    public String getAdresse() {
        return this.adresse;
    }

    public Doctorant adresse(String adresse) {
        this.setAdresse(adresse);
        return this;
    }

    public void setAdresse(String adresse) {
        this.adresse = adresse;
    }

    public Integer getNumeroTelephone() {
        return this.numeroTelephone;
    }

    public Doctorant numeroTelephone(Integer numeroTelephone) {
        this.setNumeroTelephone(numeroTelephone);
        return this;
    }

    public void setNumeroTelephone(Integer numeroTelephone) {
        this.numeroTelephone = numeroTelephone;
    }

    public String getGenre() {
        return this.genre;
    }

    public Doctorant genre(String genre) {
        this.setGenre(genre);
        return this;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public String getNomArabe() {
        return this.nomArabe;
    }

    public Doctorant nomArabe(String nomArabe) {
        this.setNomArabe(nomArabe);
        return this;
    }

    public void setNomArabe(String nomArabe) {
        this.nomArabe = nomArabe;
    }

    public String getPrnomArabe() {
        return this.prnomArabe;
    }

    public Doctorant prnomArabe(String prnomArabe) {
        this.setPrnomArabe(prnomArabe);
        return this;
    }

    public void setPrnomArabe(String prnomArabe) {
        this.prnomArabe = prnomArabe;
    }

    public Sujet getSujet() {
        return this.sujet;
    }

    public void setSujet(Sujet sujet) {
        this.sujet = sujet;
    }

    public Doctorant sujet(Sujet sujet) {
        this.setSujet(sujet);
        return this;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Doctorant user(User user) {
        this.setUser(user);
        return this;
    }

    public Promotion getPromotion() {
        return this.promotion;
    }

    public void setPromotion(Promotion promotion) {
        this.promotion = promotion;
    }

    public Doctorant promotion(Promotion promotion) {
        this.setPromotion(promotion);
        return this;
    }

    public Cursus getCursus() {
        return this.cursus;
    }

    public void setCursus(Cursus cursus) {
        this.cursus = cursus;
    }

    public Doctorant cursus(Cursus cursus) {
        this.setCursus(cursus);
        return this;
    }

    public Set<FormationDoctorant> getFormationDoctorants() {
        return this.formationDoctorants;
    }

    public void setFormationDoctorants(Set<FormationDoctorant> formationDoctorants) {
        if (this.formationDoctorants != null) {
            this.formationDoctorants.forEach(i -> i.setDoctorant(null));
        }
        if (formationDoctorants != null) {
            formationDoctorants.forEach(i -> i.setDoctorant(this));
        }
        this.formationDoctorants = formationDoctorants;
    }

    public Doctorant formationDoctorants(Set<FormationDoctorant> formationDoctorants) {
        this.setFormationDoctorants(formationDoctorants);
        return this;
    }

    public Doctorant addFormationDoctorant(FormationDoctorant formationDoctorant) {
        this.formationDoctorants.add(formationDoctorant);
        formationDoctorant.setDoctorant(this);
        return this;
    }

    public Doctorant removeFormationDoctorant(FormationDoctorant formationDoctorant) {
        this.formationDoctorants.remove(formationDoctorant);
        formationDoctorant.setDoctorant(null);
        return this;
    }

    public Set<FormationSuivie> getFormationSuivies() {
        return this.formationSuivies;
    }

    public void setFormationSuivies(Set<FormationSuivie> formationSuivies) {
        if (this.formationSuivies != null) {
            this.formationSuivies.forEach(i -> i.setDoctorant(null));
        }
        if (formationSuivies != null) {
            formationSuivies.forEach(i -> i.setDoctorant(this));
        }
        this.formationSuivies = formationSuivies;
    }

    public Doctorant formationSuivies(Set<FormationSuivie> formationSuivies) {
        this.setFormationSuivies(formationSuivies);
        return this;
    }

    public Doctorant addFormationSuivie(FormationSuivie formationSuivie) {
        this.formationSuivies.add(formationSuivie);
        formationSuivie.setDoctorant(this);
        return this;
    }

    public Doctorant removeFormationSuivie(FormationSuivie formationSuivie) {
        this.formationSuivies.remove(formationSuivie);
        formationSuivie.setDoctorant(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Doctorant)) {
            return false;
        }
        return id != null && id.equals(((Doctorant) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Doctorant{" +
            "id=" + getId() +
            ", cne='" + getCne() + "'" +
            ", etatProfessionnel=" + getEtatProfessionnel() +
            ", photoCNEPile='" + getPhotoCNEPile() + "'" +
            ", photoCNEPileContentType='" + getPhotoCNEPileContentType() + "'" +
            ", photoCNEFace='" + getPhotoCNEFace() + "'" +
            ", photoCNEFaceContentType='" + getPhotoCNEFaceContentType() + "'" +
            ", photoCv='" + getPhotoCv() + "'" +
            ", photoCvContentType='" + getPhotoCvContentType() + "'" +
            ", anneeInscription=" + getAnneeInscription() +
            ", etatDossier=" + getEtatDossier() +
            ", cin='" + getCin() + "'" +
            ", dateNaissance='" + getDateNaissance() + "'" +
            ", lieuNaissance='" + getLieuNaissance() + "'" +
            ", nationalite='" + getNationalite() + "'" +
            ", adresse='" + getAdresse() + "'" +
            ", numeroTelephone=" + getNumeroTelephone() +
            ", genre='" + getGenre() + "'" +
            ", nomArabe='" + getNomArabe() + "'" +
            ", prnomArabe='" + getPrnomArabe() + "'" +
            "}";
    }
}
