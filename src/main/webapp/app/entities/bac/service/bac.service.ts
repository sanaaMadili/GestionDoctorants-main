import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBac, getBacIdentifier } from '../bac.model';

export type EntityResponseType = HttpResponse<IBac>;
export type EntityArrayResponseType = HttpResponse<IBac[]>;

@Injectable({ providedIn: 'root' })
export class BacService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/bacs');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(bac: IBac): Observable<EntityResponseType> {
    return this.http.post<IBac>(this.resourceUrl, bac, { observe: 'response' });
  }

  update(bac: IBac): Observable<EntityResponseType> {
    return this.http.put<IBac>(`${this.resourceUrl}/${getBacIdentifier(bac) as number}`, bac, { observe: 'response' });
  }

  partialUpdate(bac: IBac): Observable<EntityResponseType> {
    return this.http.patch<IBac>(`${this.resourceUrl}/${getBacIdentifier(bac) as number}`, bac, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IBac>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
  findActive(): Observable<EntityResponseType> {
    return this.http.get<IBac>(`${this.resourceUrl}/this`, { observe: 'response' });
  }



  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IBac[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
  findBacDoctorant(id: number): Observable<EntityResponseType> {
    return this.http.get<IBac>(`${this.resourceUrl}/doctorant/${id}`, { observe: 'response' });
  }

  addBacToCollectionIfMissing(bacCollection: IBac[], ...bacsToCheck: (IBac | null | undefined)[]): IBac[] {
    const bacs: IBac[] = bacsToCheck.filter(isPresent);
    if (bacs.length > 0) {
      const bacCollectionIdentifiers = bacCollection.map(bacItem => getBacIdentifier(bacItem)!);
      const bacsToAdd = bacs.filter(bacItem => {
        const bacIdentifier = getBacIdentifier(bacItem);
        if (bacIdentifier == null || bacCollectionIdentifiers.includes(bacIdentifier)) {
          return false;
        }
        bacCollectionIdentifiers.push(bacIdentifier);
        return true;
      });
      return [...bacsToAdd, ...bacCollection];
    }
    return bacCollection;
  }
}
