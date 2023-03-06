import { IExtraUser } from 'app/entities/extra-user/extra-user.model';

export interface ISujet {
  id?: number;
  titre?: string;
  description?: string;
  domaines?: string | null;
  motsCles?: string | null;
  context?: string | null;
  profilRecherchees?: string | null;
  annee?: number;
  reference?: string | null;
  candidatures?: string | null;
  coencadrent?: IExtraUser| null;
  encadrent?: IExtraUser | null;
}

export class Sujet implements ISujet {
  constructor(
    public id?: number,
    public titre?: string,
    public description?: string,
    public domaines?: string | null,
    public motsCles?: string | null,
    public context?: string | null,
    public profilRecherchees?: string | null,
    public annee?: number,
    public reference?: string | null,
    public candidatures?: string | null,
    public coencadrent?: IExtraUser | null,
    public encadrent?: IExtraUser | null
  ) {}
}

export function getSujetIdentifier(sujet: ISujet): number | undefined {
  return sujet.id;
}
