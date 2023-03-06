import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDiplomes, getDiplomesIdentifier } from '../diplomes.model';

export type EntityResponseType = HttpResponse<IDiplomes>;
export type EntityArrayResponseType = HttpResponse<IDiplomes[]>;

@Injectable({ providedIn: 'root' })
export class DiplomesService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/diplomes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(diplomes: IDiplomes): Observable<EntityResponseType> {
    return this.http.post<IDiplomes>(this.resourceUrl, diplomes, { observe: 'response' });
  }

  update(diplomes: IDiplomes): Observable<EntityResponseType> {
    return this.http.put<IDiplomes>(`${this.resourceUrl}/${getDiplomesIdentifier(diplomes) as number}`, diplomes, { observe: 'response' });
  }

  partialUpdate(diplomes: IDiplomes): Observable<EntityResponseType> {
    return this.http.patch<IDiplomes>(`${this.resourceUrl}/${getDiplomesIdentifier(diplomes) as number}`, diplomes, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IDiplomes>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IDiplomes[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addDiplomesToCollectionIfMissing(diplomesCollection: IDiplomes[], ...diplomesToCheck: (IDiplomes | null | undefined)[]): IDiplomes[] {
    const diplomes: IDiplomes[] = diplomesToCheck.filter(isPresent);
    if (diplomes.length > 0) {
      const diplomesCollectionIdentifiers = diplomesCollection.map(diplomesItem => getDiplomesIdentifier(diplomesItem)!);
      const diplomesToAdd = diplomes.filter(diplomesItem => {
        const diplomesIdentifier = getDiplomesIdentifier(diplomesItem);
        if (diplomesIdentifier == null || diplomesCollectionIdentifiers.includes(diplomesIdentifier)) {
          return false;
        }
        diplomesCollectionIdentifiers.push(diplomesIdentifier);
        return true;
      });
      return [...diplomesToAdd, ...diplomesCollection];
    }
    return diplomesCollection;
  }
}
