package com.mycompany.myapp.charts;

public class CountDoc {
    private Integer annee;
    private Long count;

    public CountDoc(Integer annee, Long count) {
        this.annee = annee;
        this.count = count;
    }

    public Integer getAnnee() {
        return annee;
    }

    public void setAnnee(Integer annee) {
        this.annee = annee;
    }

    public Long getCount() {
        return count;
    }

    public void setCount(Long count) {
        this.count = count;
    }

    @Override
    public String toString() {
        return "CountPub{" +
            "annee=" + annee +
            ", count=" + count +
            '}';
    }
}
