import dayjs from 'dayjs/esm';
import { IExtraUser } from 'app/entities/extra-user/extra-user.model';
import { ILaboratoire } from 'app/entities/laboratoire/laboratoire.model';

export interface IChefLab {
  id?: number;
  dateDebut?: dayjs.Dayjs;
  dateFin?: dayjs.Dayjs ;
  extraUser?: IExtraUser | null;
  laboratoire?: ILaboratoire | null;
}

export class ChefLab implements IChefLab {
  constructor(
    public id?: number,
    public dateDebut?: dayjs.Dayjs,
    public dateFin?: dayjs.Dayjs,
    public extraUser?: IExtraUser | null,
    public laboratoire?: ILaboratoire | null
  ) {}
}

export function getChefLabIdentifier(chefLab: IChefLab): number | undefined {
  return chefLab.id;
}
