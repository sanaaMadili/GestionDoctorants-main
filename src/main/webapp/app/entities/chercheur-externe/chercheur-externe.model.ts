import { IUser } from 'app/entities/user/user.model';

export interface IChercheurExterne {
  id?: number;
  nom?: string | null;
  prenom?: string | null;
  email?: string | null;
  pays?: string | null;
  universite?: string | null;
  user?: IUser | null;
}

export class ChercheurExterne implements IChercheurExterne {
  constructor(
    public id?: number,
    public nom?: string | null,
    public prenom?: string | null,
    public email?: string | null,
    public pays?: string | null,
    public universite?: string | null,
    public user?: IUser | null
  ) {}
}

export function getChercheurExterneIdentifier(chercheurExterne: IChercheurExterne): number | undefined {
  return chercheurExterne.id;
}
