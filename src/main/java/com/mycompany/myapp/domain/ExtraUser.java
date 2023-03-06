package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A ExtraUser.
 */
@Entity
@Table(name = "extra_user")
public class ExtraUser implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

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

    @OneToOne
    @JoinColumn(unique = true)
    private User internalUser;

    @OneToMany(mappedBy = "encadrent")
    @JsonIgnoreProperties(value = { "encadrent" }, allowSetters = true)
    private Set<Sujet> sujets = new HashSet<>();

    @OneToMany(mappedBy = "extraUser")
    @JsonIgnoreProperties(value = { "equipe", "extraUser" }, allowSetters = true)
    private Set<MembreEquipe> membreEquipes = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ExtraUser id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCin() {
        return this.cin;
    }

    public ExtraUser cin(String cin) {
        this.setCin(cin);
        return this;
    }

    public void setCin(String cin) {
        this.cin = cin;
    }

    public Instant getDateNaissance() {
        return this.dateNaissance;
    }

    public ExtraUser dateNaissance(Instant dateNaissance) {
        this.setDateNaissance(dateNaissance);
        return this;
    }

    public void setDateNaissance(Instant dateNaissance) {
        this.dateNaissance = dateNaissance;
    }

    public String getLieuNaissance() {
        return this.lieuNaissance;
    }

    public ExtraUser lieuNaissance(String lieuNaissance) {
        this.setLieuNaissance(lieuNaissance);
        return this;
    }

    public void setLieuNaissance(String lieuNaissance) {
        this.lieuNaissance = lieuNaissance;
    }

    public String getNationalite() {
        return this.nationalite;
    }

    public ExtraUser nationalite(String nationalite) {
        this.setNationalite(nationalite);
        return this;
    }

    public void setNationalite(String nationalite) {
        this.nationalite = nationalite;
    }

    public String getAdresse() {
        return this.adresse;
    }

    public ExtraUser adresse(String adresse) {
        this.setAdresse(adresse);
        return this;
    }

    public void setAdresse(String adresse) {
        this.adresse = adresse;
    }

    public Integer getNumeroTelephone() {
        return this.numeroTelephone;
    }

    public ExtraUser numeroTelephone(Integer numeroTelephone) {
        this.setNumeroTelephone(numeroTelephone);
        return this;
    }

    public void setNumeroTelephone(Integer numeroTelephone) {
        this.numeroTelephone = numeroTelephone;
    }

    public String getGenre() {
        return this.genre;
    }

    public ExtraUser genre(String genre) {
        this.setGenre(genre);
        return this;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public String getNomArabe() {
        return this.nomArabe;
    }

    public ExtraUser nomArabe(String nomArabe) {
        this.setNomArabe(nomArabe);
        return this;
    }

    public void setNomArabe(String nomArabe) {
        this.nomArabe = nomArabe;
    }

    public String getPrnomArabe() {
        return this.prnomArabe;
    }

    public ExtraUser prnomArabe(String prnomArabe) {
        this.setPrnomArabe(prnomArabe);
        return this;
    }

    public void setPrnomArabe(String prnomArabe) {
        this.prnomArabe = prnomArabe;
    }

    public User getInternalUser() {
        return this.internalUser;
    }

    public void setInternalUser(User user) {
        this.internalUser = user;
    }

    public ExtraUser internalUser(User user) {
        this.setInternalUser(user);
        return this;
    }

    public Set<Sujet> getSujets() {
        return this.sujets;
    }

    public void setSujets(Set<Sujet> sujets) {
        if (this.sujets != null) {
            this.sujets.forEach(i -> i.setEncadrent(null));
        }
        if (sujets != null) {
            sujets.forEach(i -> i.setEncadrent(this));
        }
        this.sujets = sujets;
    }

    public ExtraUser sujets(Set<Sujet> sujets) {
        this.setSujets(sujets);
        return this;
    }

    public ExtraUser addSujet(Sujet sujet) {
        this.sujets.add(sujet);
        sujet.setEncadrent(this);
        return this;
    }

    public ExtraUser removeSujet(Sujet sujet) {
        this.sujets.remove(sujet);
        sujet.setEncadrent(null);
        return this;
    }

    public Set<MembreEquipe> getMembreEquipes() {
        return this.membreEquipes;
    }

    public void setMembreEquipes(Set<MembreEquipe> membreEquipes) {
        if (this.membreEquipes != null) {
            this.membreEquipes.forEach(i -> i.setExtraUser(null));
        }
        if (membreEquipes != null) {
            membreEquipes.forEach(i -> i.setExtraUser(this));
        }
        this.membreEquipes = membreEquipes;
    }

    public ExtraUser membreEquipes(Set<MembreEquipe> membreEquipes) {
        this.setMembreEquipes(membreEquipes);
        return this;
    }

    public ExtraUser addMembreEquipe(MembreEquipe membreEquipe) {
        this.membreEquipes.add(membreEquipe);
        membreEquipe.setExtraUser(this);
        return this;
    }

    public ExtraUser removeMembreEquipe(MembreEquipe membreEquipe) {
        this.membreEquipes.remove(membreEquipe);
        membreEquipe.setExtraUser(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ExtraUser)) {
            return false;
        }
        return id != null && id.equals(((ExtraUser) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ExtraUser{" +
            "id=" + getId() +
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
