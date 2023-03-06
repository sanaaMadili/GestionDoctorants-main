package com.mycompany.myapp.security;

/**
 * Constants for Spring Security authorities.
 */
public final class AuthoritiesConstants {

    public static final String ADMIN = "ROLE_ADMIN";

    public static final String USER = "ROLE_USER";

    public static final String DOCTORANT = "ROLE_DOCTORANT";

    public static final String RESPONSABLE = "ROLE_RESPONSABLE";

    public static final String DIRECTEUR = "ROLE_DIRECTEUR";

    public static final String PROFESSEUR = "ROLE_PROFESSEUR";

    public static final String ANONYMOUS = "ROLE_ANONYMOUS";

    private AuthoritiesConstants() {}
}
