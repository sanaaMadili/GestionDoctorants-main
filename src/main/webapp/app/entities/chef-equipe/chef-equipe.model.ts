import dayjs from 'dayjs/esm';
import { IExtraUser } from 'app/entities/extra-user/extra-user.model';
import { IEquipe } from 'app/entities/equipe/equipe.model';

export interface IChefEquipe {
  id?: number;
  dateDebut?: dayjs.Dayjs;
  dateFin?: dayjs.Dayjs;
  extraUser?: IExtraUser | null;
  equipe?: IEquipe | null;
}

export class ChefEquipe implements IChefEquipe {
  constructor(
    public id?: number,
    public dateDebut?: dayjs.Dayjs,
    public dateFin?: dayjs.Dayjs,
    public extraUser?: IExtraUser | null,
    public equipe?: IEquipe | null
  ) {}
}

export function getChefEquipeIdentifier(chefEquipe: IChefEquipe): number | undefined {
  return chefEquipe.id;
}
