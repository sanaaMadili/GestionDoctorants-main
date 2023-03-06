import { IDoctorant } from 'app/entities/doctorant/doctorant.model';

export interface IPromotion {
  id?: number;
  annee?: number;
  nom?: string | null;
  doctorants?: IDoctorant[] | null;
}

export class Promotion implements IPromotion {
  constructor(public id?: number, public annee?: number, public nom?: string | null, public doctorants?: IDoctorant[] | null) {}
}

export function getPromotionIdentifier(promotion: IPromotion): number | undefined {
  return promotion.id;
}
