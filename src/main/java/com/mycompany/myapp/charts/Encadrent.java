package com.mycompany.myapp.charts;

public class Encadrent {
    private String nom;
    private String prenom;
    private String sujet;


    public Encadrent(String nom, String prenom, String sujet) {
        this.nom = nom;
        this.prenom = prenom;
        this.sujet = sujet;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getPrenom() {
        return prenom;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public String getSujet() {
        return sujet;
    }

    public void setSujet(String sujet) {
        this.sujet = sujet;
    }

    @Override
    public String toString() {
        return "Encadrent{" +
            "nom='" + nom + '\'' +
            ", prenom='" + prenom + '\'' +
            ", sujet='" + sujet + '\'' +
            '}';
    }
}

