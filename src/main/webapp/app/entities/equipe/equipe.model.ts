import { ILaboratoire } from 'app/entities/laboratoire/laboratoire.model';
import { IMembreEquipe } from 'app/entities/membre-equipe/membre-equipe.model';
import { ExtraUser, IExtraUser } from 'app/entities/extra-user/extra-user.model';

export interface IEquipe {
  id?: number;
  nom?: string;
  abreviation?: string;
  laboratoire?: ILaboratoire | null;
  membreEquipes?: IMembreEquipe[] | null;
  extrauser ?: ExtraUser | null
}

export class Equipe implements IEquipe {
  constructor(
    public id?: number,
    public nom?: string,
    public abreviation?: string,
    public laboratoire?: ILaboratoire | null,
    public membreEquipes?: IMembreEquipe[] | null,
    public extrauser ?: ExtraUser | null
  ) {}
}

export function getEquipeIdentifier(equipe: IEquipe): number | undefined {
  return equipe.id;
}
