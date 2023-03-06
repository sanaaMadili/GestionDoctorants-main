import { IEtablissement } from 'app/entities/etablissement/etablissement.model';
import { IDoctorant } from 'app/entities/doctorant/doctorant.model';

export interface IReinscription {
  id?: number;
  formulaireReinscriptionContentType?: string | null;
  formulaireReinscription?: string | null;
  demandeContentType?: string | null;
  demande?: string | null;
  annee?: number | null;
  etablissement?: IEtablissement | null;
  doctorant?: IDoctorant | null;
}

export class Reinscription implements IReinscription {
  constructor(
    public id?: number,
    public formulaireReinscriptionContentType?: string | null,
    public formulaireReinscription?: string | null,
    public demandeContentType?: string | null,
    public demande?: string | null,
    public annee?: number | null,
    public etablissement?: IEtablissement | null,
    public doctorant?: IDoctorant | null
  ) {}
}

export function getReinscriptionIdentifier(reinscription: IReinscription): number | undefined {
  return reinscription.id;
}
