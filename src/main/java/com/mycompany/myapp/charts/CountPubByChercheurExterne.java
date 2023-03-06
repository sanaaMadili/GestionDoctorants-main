package com.mycompany.myapp.charts;

public class CountPubByChercheurExterne {
    private Integer annee;
    private Long count;

    public CountPubByChercheurExterne(Integer annee, Long count) {
        this.annee = annee;
        this.count = count;
    }

    public Integer getAnnee() {
        return annee;
    }

    public void setAnnee(Integer annee) {
        this.annee = annee;
    }

    @Override
    public String toString() {
        return "CountPubByChercheurExterne{" +
            "annee=" + annee +
            ", count=" + count +
            '}';
    }

    public Long getCount() {
        return count;
    }

    public void setCount(Long count) {
        this.count = count;
    }
}
