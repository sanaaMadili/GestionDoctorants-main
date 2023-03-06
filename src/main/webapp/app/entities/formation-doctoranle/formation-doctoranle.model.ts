import { IFormationSuivie } from 'app/entities/formation-suivie/formation-suivie.model';

export interface IFormationDoctoranle {
  id?: number;
  thematique?: string;
  description?: string | null;
  formationSuivies?: IFormationSuivie[] | null;
}

export class FormationDoctoranle implements IFormationDoctoranle {
  constructor(
    public id?: number,
    public thematique?: string,
    public description?: string | null,
    public formationSuivies?: IFormationSuivie[] | null
  ) {}
}

export function getFormationDoctoranleIdentifier(formationDoctoranle: IFormationDoctoranle): number | undefined {
  return formationDoctoranle.id;
}
