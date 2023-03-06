import { ICursus } from 'app/entities/cursus/cursus.model';
import { IFormationDoctorant } from 'app/entities/formation-doctorant/formation-doctorant.model';

export interface IFormation {
  id?: number;
  nom?: string | null;
  niveau?: number | null;
  nbAnnee?: number | null;
  rang?: number | null;
  cursus?: ICursus | null;
  formationDoctorants?: IFormationDoctorant[] | null;
}

export class Formation implements IFormation {
  constructor(
    public id?: number,
    public nom?: string | null,
    public niveau?: number | null,
    public nbAnnee?: number | null,
    public rang?: number | null,
    public cursus?: ICursus | null,
    public formationDoctorants?: IFormationDoctorant[] | null
  ) {}
}

export function getFormationIdentifier(formation: IFormation): number | undefined {
  return formation.id;
}
export function getFormationIdentifie(formation: IFormation): number  {
  return <number>formation.id;
}
