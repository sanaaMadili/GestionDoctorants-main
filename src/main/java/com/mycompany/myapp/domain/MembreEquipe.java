package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A MembreEquipe.
 */
@Entity
@Table(name = "membre_equipe")
public class MembreEquipe implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "date_debut", nullable = false)
    private LocalDate dateDebut;

    @Column(name = "datefin")
    private LocalDate datefin;

    @ManyToOne
    @JsonIgnoreProperties(value = { "laboratoire", "membreEquipes" }, allowSetters = true)
    private Equipe equipe;

    @ManyToOne
    @JsonIgnoreProperties(value = { "internalUser", "sujets", "membreEquipes" }, allowSetters = true)
    private ExtraUser extraUser;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public MembreEquipe id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDateDebut() {
        return this.dateDebut;
    }

    public MembreEquipe dateDebut(LocalDate dateDebut) {
        this.setDateDebut(dateDebut);
        return this;
    }

    public void setDateDebut(LocalDate dateDebut) {
        this.dateDebut = dateDebut;
    }

    public LocalDate getDatefin() {
        return this.datefin;
    }

    public MembreEquipe datefin(LocalDate datefin) {
        this.setDatefin(datefin);
        return this;
    }

    public void setDatefin(LocalDate datefin) {
        this.datefin = datefin;
    }

    public Equipe getEquipe() {
        return this.equipe;
    }

    public void setEquipe(Equipe equipe) {
        this.equipe = equipe;
    }

    public MembreEquipe equipe(Equipe equipe) {
        this.setEquipe(equipe);
        return this;
    }

    public ExtraUser getExtraUser() {
        return this.extraUser;
    }

    public void setExtraUser(ExtraUser extraUser) {
        this.extraUser = extraUser;
    }

    public MembreEquipe extraUser(ExtraUser extraUser) {
        this.setExtraUser(extraUser);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof MembreEquipe)) {
            return false;
        }
        return id != null && id.equals(((MembreEquipe) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "MembreEquipe{" +
            "id=" + getId() +
            ", dateDebut='" + getDateDebut() + "'" +
            ", datefin='" + getDatefin() + "'" +
            "}";
    }
}
