import { IDoctorant } from 'app/entities/doctorant/doctorant.model';
import { IFormation } from 'app/entities/formation/formation.model';

export interface ICursus {
  id?: number;
  nom?: string | null;
  nbFormation?: number | null;
  doctorants?: IDoctorant[] | null;
  formations?: IFormation[] | null;
}

export class Cursus implements ICursus {
  constructor(
    public id?: number,
    public nom?: string | null,
    public nbFormation?: number | null,
    public doctorants?: IDoctorant[] | null,
    public formations?: IFormation[] | null
  ) {}
}

export function getCursusIdentifier(cursus: ICursus): number | undefined {
  return cursus.id;
}
