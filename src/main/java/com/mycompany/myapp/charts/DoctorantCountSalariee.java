package com.mycompany.myapp.charts;

public class DoctorantCountSalariee {
    private Integer etatProfessionnel;
    private Integer anneeInscription;
    private Long count;

    public DoctorantCountSalariee(Integer etatProfessionnel, Integer anneeInscription, Long count) {
        this.etatProfessionnel = etatProfessionnel;
        this.anneeInscription = anneeInscription;
        this.count = count;
    }

    public Integer getAnneeInscription() {
        return anneeInscription;
    }

    public void setAnneeInscription(Integer anneeInscription) {
        this.anneeInscription = anneeInscription;
    }

    public Integer getEtatProfessionnel() {
        return etatProfessionnel;
    }

    public void setEtatProfessionnel(Integer etatProfessionnel) {
        this.etatProfessionnel = etatProfessionnel;
    }

    public Long getCount() {
        return count;
    }

    public void setCount(Long count) {
        this.count = count;
    }

    @Override
    public String toString() {
        return "DoctorantCountSalariee{" +
            "etatProfessionnel=" + etatProfessionnel +
            ", anneeInscription=" + anneeInscription +
            ", count=" + count +
            '}';
    }
}
