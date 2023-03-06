package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A FormationDoctoranle.
 */
@Entity
@Table(name = "formation_doctoranle")
public class FormationDoctoranle implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "thematique", nullable = false)
    private String thematique;

    @Column(name = "description")
    private String description;

    @OneToMany(mappedBy = "formationDoctoranle")
    @JsonIgnoreProperties(value = { "formationDoctoranle", "doctorant" }, allowSetters = true)
    private Set<FormationSuivie> formationSuivies = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public FormationDoctoranle id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getThematique() {
        return this.thematique;
    }

    public FormationDoctoranle thematique(String thematique) {
        this.setThematique(thematique);
        return this;
    }

    public void setThematique(String thematique) {
        this.thematique = thematique;
    }

    public String getDescription() {
        return this.description;
    }

    public FormationDoctoranle description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Set<FormationSuivie> getFormationSuivies() {
        return this.formationSuivies;
    }

    public void setFormationSuivies(Set<FormationSuivie> formationSuivies) {
        if (this.formationSuivies != null) {
            this.formationSuivies.forEach(i -> i.setFormationDoctoranle(null));
        }
        if (formationSuivies != null) {
            formationSuivies.forEach(i -> i.setFormationDoctoranle(this));
        }
        this.formationSuivies = formationSuivies;
    }

    public FormationDoctoranle formationSuivies(Set<FormationSuivie> formationSuivies) {
        this.setFormationSuivies(formationSuivies);
        return this;
    }

    public FormationDoctoranle addFormationSuivie(FormationSuivie formationSuivie) {
        this.formationSuivies.add(formationSuivie);
        formationSuivie.setFormationDoctoranle(this);
        return this;
    }

    public FormationDoctoranle removeFormationSuivie(FormationSuivie formationSuivie) {
        this.formationSuivies.remove(formationSuivie);
        formationSuivie.setFormationDoctoranle(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof FormationDoctoranle)) {
            return false;
        }
        return id != null && id.equals(((FormationDoctoranle) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "FormationDoctoranle{" +
            "id=" + getId() +
            ", thematique='" + getThematique() + "'" +
            ", description='" + getDescription() + "'" +
            "}";
    }
}
