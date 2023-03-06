import dayjs from 'dayjs/esm';
import { IFormationDoctoranle } from 'app/entities/formation-doctoranle/formation-doctoranle.model';
import { IDoctorant } from 'app/entities/doctorant/doctorant.model';

export interface IFormationSuivie {
  id?: number;
  duree?: number;
  attestationContentType?: string | null;
  attestation?: string | null;
  date?: dayjs.Dayjs | null;
  titre?: string | null;
  formationDoctoranle?: IFormationDoctoranle | null;
  doctorant?: IDoctorant | null;
}

export class FormationSuivie implements IFormationSuivie {
  constructor(
    public id?: number,
    public duree?: number,
    public attestationContentType?: string | null,
    public attestation?: string | null,
    public date?: dayjs.Dayjs | null,
    public titre?: string | null,
    public formationDoctoranle?: IFormationDoctoranle | null,
    public doctorant?: IDoctorant | null
  ) {}
}

export function getFormationSuivieIdentifier(formationSuivie: IFormationSuivie): number | undefined {
  return formationSuivie.id;
}
