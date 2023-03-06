import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICursus, getCursusIdentifier } from '../cursus.model';

export type EntityResponseType = HttpResponse<ICursus>;
export type EntityArrayResponseType = HttpResponse<ICursus[]>;

@Injectable({ providedIn: 'root' })
export class CursusService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/cursuses');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(cursus: ICursus): Observable<EntityResponseType> {
    return this.http.post<ICursus>(this.resourceUrl, cursus, { observe: 'response' });
  }

  update(cursus: ICursus): Observable<EntityResponseType> {
    return this.http.put<ICursus>(`${this.resourceUrl}/${getCursusIdentifier(cursus) as number}`, cursus, { observe: 'response' });
  }

  partialUpdate(cursus: ICursus): Observable<EntityResponseType> {
    return this.http.patch<ICursus>(`${this.resourceUrl}/${getCursusIdentifier(cursus) as number}`, cursus, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICursus>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICursus[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addCursusToCollectionIfMissing(
    cursusCollection: ICursus[], ...cursusesToCheck: (ICursus | null | undefined)[]):ICursus[] {
    const cursuses: ICursus[] = cursusesToCheck.filter(isPresent);
    if (cursuses.length > 0) {
      const cursusCollectionIdentifiers = cursusCollection.map(cursusItem => getCursusIdentifier(cursusItem)!);
      const cursusesToAdd = cursuses.filter(cursusItem => {
        const cursusIdentifier = getCursusIdentifier(cursusItem);
        if (cursusIdentifier == null || cursusCollectionIdentifiers.includes(cursusIdentifier)) {
          return false;
        }
        cursusCollectionIdentifiers.push(cursusIdentifier);
        return true;
      });
      return [...cursusesToAdd, ...cursusCollection];
    }
    return cursusCollection;
  }
}
