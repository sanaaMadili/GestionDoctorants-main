package com.mycompany.myapp.charts;

import java.util.List;

public class DocS {
    private Integer etatProfessionnel;
    private List<Long> count;

    public DocS(Integer etatProfessionnel, List<Long> count) {
        this.etatProfessionnel = etatProfessionnel;
        this.count = count;
    }

    public Integer getEtatProfessionnel() {
        return etatProfessionnel;
    }

    public void setEtatProfessionnel(Integer etatProfessionnel) {
        this.etatProfessionnel = etatProfessionnel;
    }



    public List<Long> getCount() {
        return count;
    }

    public void setCount(List<Long> count) {
        this.count = count;
    }
}
