import { IFormationDoctorant } from 'app/entities/formation-doctorant/formation-doctorant.model';

export interface IEtablissement {
  id?: number;
  nom?: string | null;
  ville?: string | null;
  universite?: string | null;
  addresse?: string | null;
  formationDoctorant?: IFormationDoctorant | null;
}

export class Etablissement implements IEtablissement {
  constructor(
    public id?: number,
    public nom?: string | null,
    public ville?: string | null,
    public universite?: string | null,
    public addresse?: string | null,
    public formationDoctorant?: IFormationDoctorant | null
  ) {}
}

export function getEtablissementIdentifier(etablissement: IEtablissement): number | undefined {
  return etablissement.id;
}
