import { IDoctorant } from 'app/entities/doctorant/doctorant.model';

export interface IBourse {
  id?: number;
  type?: string | null;
  doctorant?: IDoctorant | null;
}

export class Bourse implements IBourse {
  constructor(public id?: number, public type?: string | null, public doctorant?: IDoctorant | null) {}
}

export function getBourseIdentifier(bourse: IBourse): number | undefined {
  return bourse.id;
}
