import dayjs from 'dayjs/esm';
import { IEquipe } from 'app/entities/equipe/equipe.model';
import { IExtraUser } from 'app/entities/extra-user/extra-user.model';

export interface IMembreEquipe {
  id?: number;
  dateDebut?: dayjs.Dayjs;
  datefin?: dayjs.Dayjs | null;
  equipe?: IEquipe | null;
  extraUser?: IExtraUser | null;
}

export class MembreEquipe implements IMembreEquipe {
  constructor(
    public id?: number,
    public dateDebut?: dayjs.Dayjs,
    public datefin?: dayjs.Dayjs | null,
    public equipe?: IEquipe | null,
    public extraUser?: IExtraUser | null
  ) {}
}

export function getMembreEquipeIdentifier(membreEquipe: IMembreEquipe): number | undefined {
  return membreEquipe.id;
}
