import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IChercheurExterne, getChercheurExterneIdentifier } from '../chercheur-externe.model';

export type EntityResponseType = HttpResponse<IChercheurExterne>;
export type EntityArrayResponseType = HttpResponse<IChercheurExterne[]>;

@Injectable({ providedIn: 'root' })
export class ChercheurExterneService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/chercheur-externes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(chercheurExterne: IChercheurExterne): Observable<EntityResponseType> {
    return this.http.post<IChercheurExterne>(this.resourceUrl, chercheurExterne, { observe: 'response' });
  }

  update(chercheurExterne: IChercheurExterne): Observable<EntityResponseType> {
    return this.http.put<IChercheurExterne>(
      `${this.resourceUrl}/${getChercheurExterneIdentifier(chercheurExterne) as number}`,
      chercheurExterne,
      { observe: 'response' }
    );
  }

  partialUpdate(chercheurExterne: IChercheurExterne): Observable<EntityResponseType> {
    return this.http.patch<IChercheurExterne>(
      `${this.resourceUrl}/${getChercheurExterneIdentifier(chercheurExterne) as number}`,
      chercheurExterne,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IChercheurExterne>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IChercheurExterne[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addChercheurExterneToCollectionIfMissing(
    chercheurExterneCollection: IChercheurExterne[],
    ...chercheurExternesToCheck: (IChercheurExterne | null | undefined)[]
  ): IChercheurExterne[] {
    const chercheurExternes: IChercheurExterne[] = chercheurExternesToCheck.filter(isPresent);
    if (chercheurExternes.length > 0) {
      const chercheurExterneCollectionIdentifiers = chercheurExterneCollection.map(
        chercheurExterneItem => getChercheurExterneIdentifier(chercheurExterneItem)!
      );
      const chercheurExternesToAdd = chercheurExternes.filter(chercheurExterneItem => {
        const chercheurExterneIdentifier = getChercheurExterneIdentifier(chercheurExterneItem);
        if (chercheurExterneIdentifier == null || chercheurExterneCollectionIdentifiers.includes(chercheurExterneIdentifier)) {
          return false;
        }
        chercheurExterneCollectionIdentifiers.push(chercheurExterneIdentifier);
        return true;
      });
      return [...chercheurExternesToAdd, ...chercheurExterneCollection];
    }
    return chercheurExterneCollection;
  }
}
