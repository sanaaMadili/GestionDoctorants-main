import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPromotion, getPromotionIdentifier } from '../promotion.model';

export type EntityResponseType = HttpResponse<IPromotion>;
export type EntityArrayResponseType = HttpResponse<IPromotion[]>;

@Injectable({ providedIn: 'root' })
export class PromotionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/promotions');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(promotion: IPromotion): Observable<EntityResponseType> {
    return this.http.post<IPromotion>(this.resourceUrl, promotion, { observe: 'response' });
  }

  update(promotion: IPromotion): Observable<EntityResponseType> {
    return this.http.put<IPromotion>(`${this.resourceUrl}/${getPromotionIdentifier(promotion) as number}`, promotion, {
      observe: 'response',
    });
  }

  partialUpdate(promotion: IPromotion): Observable<EntityResponseType> {
    return this.http.patch<IPromotion>(`${this.resourceUrl}/${getPromotionIdentifier(promotion) as number}`, promotion, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPromotion>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPromotion[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addPromotionToCollectionIfMissing(
    promotionCollection: IPromotion[],
    ...promotionsToCheck: (IPromotion | null | undefined)[]
  ): IPromotion[] {
    const promotions: IPromotion[] = promotionsToCheck.filter(isPresent);
    if (promotions.length > 0) {
      const promotionCollectionIdentifiers = promotionCollection.map(promotionItem => getPromotionIdentifier(promotionItem)!);
      const promotionsToAdd = promotions.filter(promotionItem => {
        const promotionIdentifier = getPromotionIdentifier(promotionItem);
        if (promotionIdentifier == null || promotionCollectionIdentifiers.includes(promotionIdentifier)) {
          return false;
        }
        promotionCollectionIdentifiers.push(promotionIdentifier);
        return true;
      });
      return [...promotionsToAdd, ...promotionCollection];
    }
    return promotionCollection;
  }
}
