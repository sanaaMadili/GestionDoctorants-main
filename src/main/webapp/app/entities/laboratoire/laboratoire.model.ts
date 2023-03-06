import { IEquipe } from 'app/entities/equipe/equipe.model';
import { IExtraUser } from 'app/entities/extra-user/extra-user.model';
export interface ILaboratoire {
  id?: number;
  nom?: string;
  abreviation?: string;
  extrauser?:IExtraUser | null;
  equipes?: IEquipe[] | null;
}

export class Laboratoire implements ILaboratoire {
  constructor(public id?: number, public nom?: string, public abreviation?: string, public extrauser?: IExtraUser | null, public equipes?: IEquipe[] | null) {}
}

export function getLaboratoireIdentifier(laboratoire: ILaboratoire): number | undefined {
  return laboratoire.id;
}
