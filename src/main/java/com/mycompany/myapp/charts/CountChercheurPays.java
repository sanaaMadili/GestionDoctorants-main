package com.mycompany.myapp.charts;

public class CountChercheurPays {
    private String pays;
    private Long count;
    private Integer annee;

    public CountChercheurPays(String pays, Integer annee, Long count) {
        this.pays = pays;
        this.count = count;
        this.annee = annee;
    }

    public Integer getAnnee() {
        return annee;
    }

    public void setAnnee(Integer annee) {
        this.annee = annee;
    }


    public String getPays() {
        return pays;
    }

    public void setPays(String pays) {
        this.pays = pays;
    }

    public Long getCount() {
        return count;
    }

    public void setCount(Long count) {
        this.count = count;
    }

    @Override
    public String toString() {
        return "CountChercheurPays{" +
            "pays='" + pays + '\'' +
            ", count=" + count +
            '}';
    }
}
