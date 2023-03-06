import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFormationDoctorant, getFormationDoctorantIdentifier } from '../formation-doctorant.model';

export type EntityResponseType = HttpResponse<IFormationDoctorant>;
export type EntityArrayResponseType = HttpResponse<IFormationDoctorant[]>;

@Injectable({ providedIn: 'root' })
export class FormationDoctorantService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/formation-doctorants');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(formationDoctorant: IFormationDoctorant): Observable<EntityResponseType> {
    return this.http.post<IFormationDoctorant>(this.resourceUrl, formationDoctorant, { observe: 'response' });
  }

  update(formationDoctorant: IFormationDoctorant): Observable<EntityResponseType> {
    return this.http.put<IFormationDoctorant>(
      `${this.resourceUrl}/${getFormationDoctorantIdentifier(formationDoctorant) as number}`,
      formationDoctorant,
      { observe: 'response' }
    );
  }

  partialUpdate(formationDoctorant: IFormationDoctorant): Observable<EntityResponseType> {
    return this.http.patch<IFormationDoctorant>(
      `${this.resourceUrl}/${getFormationDoctorantIdentifier(formationDoctorant) as number}`,
      formationDoctorant,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IFormationDoctorant>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  findActive(formation: number) : Observable<EntityResponseType> {
    return this.http.get<IFormationDoctorant>(`${this.resourceUrl}/formation/${formation}`, { observe: 'response' });
  }


  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IFormationDoctorant[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  findformation(): Observable<EntityArrayResponseType> {
    return this.http.get<IFormationDoctorant[]>(`${this.resourceUrl}/formations/`, { observe: 'response' });
  }
  findByDoctorant(id: number) : Observable<EntityArrayResponseType> {
    return this.http.get<IFormationDoctorant[]>(`${this.resourceUrl}/formations/${id}`, { observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addFormationDoctorantToCollectionIfMissing(
    formationDoctorantCollection: IFormationDoctorant[],
    ...formationDoctorantsToCheck: (IFormationDoctorant | null | undefined)[]
  ): IFormationDoctorant[] {
    const formationDoctorants: IFormationDoctorant[] = formationDoctorantsToCheck.filter(isPresent);
    if (formationDoctorants.length > 0) {
      const formationDoctorantCollectionIdentifiers = formationDoctorantCollection.map(
        formationDoctorantItem => getFormationDoctorantIdentifier(formationDoctorantItem)!
      );
      const formationDoctorantsToAdd = formationDoctorants.filter(formationDoctorantItem => {
        const formationDoctorantIdentifier = getFormationDoctorantIdentifier(formationDoctorantItem);
        if (formationDoctorantIdentifier == null || formationDoctorantCollectionIdentifiers.includes(formationDoctorantIdentifier)) {
          return false;
        }
        formationDoctorantCollectionIdentifiers.push(formationDoctorantIdentifier);
        return true;
      });
      return [...formationDoctorantsToAdd, ...formationDoctorantCollection];
    }
    return formationDoctorantCollection;
  }
}
