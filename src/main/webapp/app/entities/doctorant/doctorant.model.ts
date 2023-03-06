import dayjs from 'dayjs/esm';
import { ISujet } from 'app/entities/sujet/sujet.model';
import { IUser } from 'app/entities/user/user.model';
import { IPromotion } from 'app/entities/promotion/promotion.model';
import { ICursus } from 'app/entities/cursus/cursus.model';
import { IFormationDoctorant } from 'app/entities/formation-doctorant/formation-doctorant.model';
import { IFormationSuivie } from 'app/entities/formation-suivie/formation-suivie.model';
import {User} from "../../admin/user-management/user-management.model";

export interface IDoctorant {
  id?: number;
  cne?: string;
  etatProfessionnel?: number;
  photoCNEPileContentType?: string | null;
  photoCNEPile?: string | null;
  photoCNEFaceContentType?: string | null;
  photoCNEFace?: string | null;
  photoCvContentType?: string | null;
  photoCv?: string | null;
  anneeInscription?: number | null;
  etatDossier?: number | null;
  cin?: string;
  dateNaissance?: dayjs.Dayjs;
  lieuNaissance?: string;
  nationalite?: string;
  adresse?: string;
  numeroTelephone?: number;
  genre?: string;
  nomArabe?: string;
  prnomArabe?: string;
  sujet?: ISujet | null;
  user?: User | null;
  promotion?: IPromotion | null;
  cursus?: ICursus | null;
  formationDoctorants?: IFormationDoctorant[] | null;
  formationSuivies?: IFormationSuivie[] | null;
}

export class Doctorant implements IDoctorant {
  constructor(
    public id?: number,
    public cne?: string,
    public etatProfessionnel?: number,
    public photoCNEPileContentType?: string | null,
    public photoCNEPile?: string | null,
    public photoCNEFaceContentType?: string | null,
    public photoCNEFace?: string | null,
    public photoCvContentType?: string | null,
    public photoCv?: string | null,
    public anneeInscription?: number | null,
    public etatDossier?: number | null,
    public cin?: string,
    public dateNaissance?: dayjs.Dayjs,
    public lieuNaissance?: string,
    public nationalite?: string,
    public adresse?: string,
    public numeroTelephone?: number,
    public genre?: string,
    public nomArabe?: string,
    public prnomArabe?: string,
    public sujet?: ISujet | null,
    public user?: IUser | null,
    public promotion?: IPromotion | null,
    public cursus?: ICursus | null,
    public formationDoctorants?: IFormationDoctorant[] | null,
    public formationSuivies?: IFormationSuivie[] | null
  ) {}
}

export function getDoctorantIdentifier(doctorant: IDoctorant): number | undefined {
  return doctorant.id;
}
