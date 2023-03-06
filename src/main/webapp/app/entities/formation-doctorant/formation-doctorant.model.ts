import { IFormation } from 'app/entities/formation/formation.model';
import { IDoctorant } from 'app/entities/doctorant/doctorant.model';
import { IEtablissement } from 'app/entities/etablissement/etablissement.model';

export interface IFormationDoctorant {
  id?: number;
  specialite?: string | null;
  type?: string | null;
  dateObtention?: string | null;
  note1?: number | null;
  scanneNote1ContentType?: string | null;
  scanneNote1?: string | null;
  note2?: number | null;
  scanneNote2ContentType?: string | null;
  scanneNote2?: string | null;
  note3?: number | null;
  scanneNote3ContentType?: string | null;
  scanneNote3?: string | null;
  note4?: number | null;
  scanneNote4ContentType?: string | null;
  scanneNote4?: string | null;
  note5?: number | null;
  scanneNote5ContentType?: string | null;
  scanneNote5?: string | null;
  scanneDiplomeContentType?: string | null;
  scanneDiplome?: string | null;
  mention?: string | null;
  formation?: IFormation | null;
  doctorant?: IDoctorant | null;
  etablissements?: IEtablissement[] | null;
}

export class FormationDoctorant implements IFormationDoctorant {
  constructor(
    public id?: number,
    public specialite?: string | null,
    public type?: string | null,
    public dateObtention?: string | null,
    public note1?: number | null,
    public scanneNote1ContentType?: string | null,
    public scanneNote1?: string | null,
    public note2?: number | null,
    public scanneNote2ContentType?: string | null,
    public scanneNote2?: string | null,
    public note3?: number | null,
    public scanneNote3ContentType?: string | null,
    public scanneNote3?: string | null,
    public note4?: number | null,
    public scanneNote4ContentType?: string | null,
    public scanneNote4?: string | null,
    public note5?: number | null,
    public scanneNote5ContentType?: string | null,
    public scanneNote5?: string | null,
    public scanneDiplomeContentType?: string | null,
    public scanneDiplome?: string | null,
    public mention?: string | null,
    public formation?: IFormation | null,
    public doctorant?: IDoctorant | null,
    public etablissements?: IEtablissement[] | null
  ) {}
}

export function getFormationDoctorantIdentifier(formationDoctorant: IFormationDoctorant): number | undefined {
  return formationDoctorant.id;
}
