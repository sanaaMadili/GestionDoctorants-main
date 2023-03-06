import { IDoctorant } from 'app/entities/doctorant/doctorant.model';

export interface IBac {
  id?: number;
  serieBac?: string | null;
  typeBac?: string | null;
  anneeObtention?: string | null;
  noteBac?: number | null;
  scanneBacContentType?: string | null;
  scanneBac?: string | null;
  mention?: string | null;
  villeObtention?: string | null;
  doctorant?: IDoctorant | null;
}

export class Bac implements IBac {
  constructor(
    public id?: number,
    public serieBac?: string | null,
    public typeBac?: string | null,
    public anneeObtention?: string | null,
    public noteBac?: number | null,
    public scanneBacContentType?: string | null,
    public scanneBac?: string | null,
    public mention?: string | null,
    public villeObtention?: string | null,
    public doctorant?: IDoctorant | null
  ) {}
}

export function getBacIdentifier(bac: IBac): number | undefined {
  return bac.id;
}
