import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';
import { ISujet } from 'app/entities/sujet/sujet.model';
import { IMembreEquipe } from 'app/entities/membre-equipe/membre-equipe.model';

export interface IExtraUser {
  id?: number;
  cin?: string;
  dateNaissance?: dayjs.Dayjs;
  lieuNaissance?: string;
  nationalite?: string;
  adresse?: string;
  numeroTelephone?: number;
  genre?: string;
  nomArabe?: string;
  prnomArabe?: string;
  internalUser?: IUser ;
  sujets?: ISujet[] | null;
  membreEquipes?: IMembreEquipe[] | null;
}

export class ExtraUser implements IExtraUser {
  constructor(
    public id?: number,
    public cin?: string,
    public dateNaissance?: dayjs.Dayjs,
    public lieuNaissance?: string,
    public nationalite?: string,
    public adresse?: string,
    public numeroTelephone?: number,
    public genre?: string,
    public nomArabe?: string,
    public prnomArabe?: string,
    public internalUser?: IUser ,
    public sujets?: ISujet[] | null,
    public membreEquipes?: IMembreEquipe[] | null
  ) {}

}

export function getExtraUserIdentifier(extraUser: IExtraUser): number | undefined {
  return extraUser.id;
}
