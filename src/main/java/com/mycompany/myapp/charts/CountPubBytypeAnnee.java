package com.mycompany.myapp.charts;

public class CountPubBytypeAnnee {
    private Integer annee;
    private Long count;
    private String type;

    public CountPubBytypeAnnee(Integer annee, Long count, String type) {
        this.annee = annee;
        this.count = count;
        this.type = type;
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

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    @Override
    public String toString() {
        return "CountPubBytypeAnnee{" +
            "annee=" + annee +
            ", count=" + count +
            ", type='" + type + '\'' +
            '}';
    }
}
