import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IReinscription, getReinscriptionIdentifier } from '../reinscription.model';

export type EntityResponseType = HttpResponse<IReinscription>;
export type EntityArrayResponseType = HttpResponse<IReinscription[]>;

@Injectable({ providedIn: 'root' })
export class ReinscriptionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/reinscriptions');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(reinscription: IReinscription): Observable<EntityResponseType> {
    return this.http.post<IReinscription>(this.resourceUrl, reinscription, { observe: 'response' });
  }

  update(reinscription: IReinscription): Observable<EntityResponseType> {
    return this.http.put<IReinscription>(`${this.resourceUrl}/${getReinscriptionIdentifier(reinscription) as number}`, reinscription, {
      observe: 'response',
    });
  }

  partialUpdate(reinscription: IReinscription): Observable<EntityResponseType> {
    return this.http.patch<IReinscription>(`${this.resourceUrl}/${getReinscriptionIdentifier(reinscription) as number}`, reinscription, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IReinscription>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IReinscription[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

 condition(): Observable<HttpResponse<boolean>> {
    return this.http.get<boolean>(`${this.resourceUrl}/condition`, {observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addReinscriptionToCollectionIfMissing(
    reinscriptionCollection: IReinscription[],
    ...reinscriptionsToCheck: (IReinscription | null | undefined)[]
  ): IReinscription[] {
    const reinscriptions: IReinscription[] = reinscriptionsToCheck.filter(isPresent);
    if (reinscriptions.length > 0) {
      const reinscriptionCollectionIdentifiers = reinscriptionCollection.map(
        reinscriptionItem => getReinscriptionIdentifier(reinscriptionItem)!
      );
      const reinscriptionsToAdd = reinscriptions.filter(reinscriptionItem => {
        const reinscriptionIdentifier = getReinscriptionIdentifier(reinscriptionItem);
        if (reinscriptionIdentifier == null || reinscriptionCollectionIdentifiers.includes(reinscriptionIdentifier)) {
          return false;
        }
        reinscriptionCollectionIdentifiers.push(reinscriptionIdentifier);
        return true;
      });
      return [...reinscriptionsToAdd, ...reinscriptionCollection];
    }
    return reinscriptionCollection;
  }
}
