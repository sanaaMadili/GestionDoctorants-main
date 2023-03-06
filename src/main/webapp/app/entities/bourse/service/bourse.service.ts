import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import {IBourse, getBourseIdentifier, Bourse} from '../bourse.model';

export type EntityResponseType = HttpResponse<IBourse>;
export type EntityArrayResponseType = HttpResponse<IBourse[]>;
export type EntityArrayResponseType2 = HttpResponse<number[]>;

@Injectable({ providedIn: 'root' })
export class BourseService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/bourses');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(bourse: IBourse): Observable<EntityResponseType> {
    return this.http.post<IBourse>(this.resourceUrl, bourse, { observe: 'response' });
  }

  update(bourse: IBourse): Observable<EntityResponseType> {
    return this.http.put<IBourse>(`${this.resourceUrl}/${getBourseIdentifier(bourse) as number}`, bourse, { observe: 'response' });
  }

  partialUpdate(bourse: IBourse): Observable<EntityResponseType> {
    return this.http.patch<IBourse>(`${this.resourceUrl}/${getBourseIdentifier(bourse) as number}`, bourse, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IBourse>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  findByDoc(login: string): Observable<EntityResponseType> {
    return this.http.get<Bourse>(`${this.resourceUrl}/doctorant/${login}`, { observe: 'response' });
  }

  findDocs(): Observable<EntityArrayResponseType2> {
    return this.http.get<number[]>(`${this.resourceUrl}/doctorant`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IBourse[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addBourseToCollectionIfMissing(bourseCollection: IBourse[], ...boursesToCheck: (IBourse | null | undefined)[]): IBourse[] {
    const bourses: IBourse[] = boursesToCheck.filter(isPresent);
    if (bourses.length > 0) {
      const bourseCollectionIdentifiers = bourseCollection.map(bourseItem => getBourseIdentifier(bourseItem)!);
      const boursesToAdd = bourses.filter(bourseItem => {
        const bourseIdentifier = getBourseIdentifier(bourseItem);
        if (bourseIdentifier == null || bourseCollectionIdentifiers.includes(bourseIdentifier)) {
          return false;
        }
        bourseCollectionIdentifiers.push(bourseIdentifier);
        return true;
      });
      return [...boursesToAdd, ...bourseCollection];
    }
    return bourseCollection;
  }
}
