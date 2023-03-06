import { IChercheurExterne } from 'app/entities/chercheur-externe/chercheur-externe.model';
import {IUser} from "../../admin/user-management/user-management.model";

export interface IPublication {
  id?: number;
  titre?: string;
  date?: number;
  description?: string;
  type?: string | null;
  articleContentType?: string | null;
  article?: string | null;
  chercheurs?: IUser[] | null;
  chercheurExternes?: IChercheurExterne[] | null;
  user?: IUser | null;
}

export class Publication implements IPublication {
  constructor(
    public id?: number,
    public titre?: string,
    public date?: number,
    public description?: string,
    public type?: string | null,
    public articleContentType?: string | null,
    public article?: string | null,
    public chercheurs?: IUser[] | null,
    public chercheurExternes?: IChercheurExterne[] | null,
    public user?: IUser | null
  ) {}
}

export function getPublicationIdentifier(publication: IPublication): number | undefined {
  return publication.id;
}
