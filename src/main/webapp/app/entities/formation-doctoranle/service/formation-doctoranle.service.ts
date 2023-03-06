import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFormationDoctoranle, getFormationDoctoranleIdentifier } from '../formation-doctoranle.model';

export type EntityResponseType = HttpResponse<IFormationDoctoranle>;
export type EntityArrayResponseType = HttpResponse<IFormationDoctoranle[]>;

@Injectable({ providedIn: 'root' })
export class FormationDoctoranleService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/formation-doctoranles');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(formationDoctoranle: IFormationDoctoranle): Observable<EntityResponseType> {
    return this.http.post<IFormationDoctoranle>(this.resourceUrl, formationDoctoranle, { observe: 'response' });
  }

  update(formationDoctoranle: IFormationDoctoranle): Observable<EntityResponseType> {
    return this.http.put<IFormationDoctoranle>(
      `${this.resourceUrl}/${getFormationDoctoranleIdentifier(formationDoctoranle) as number}`,
      formationDoctoranle,
      { observe: 'response' }
    );
  }

  partialUpdate(formationDoctoranle: IFormationDoctoranle): Observable<EntityResponseType> {
    return this.http.patch<IFormationDoctoranle>(
      `${this.resourceUrl}/${getFormationDoctoranleIdentifier(formationDoctoranle) as number}`,
      formationDoctoranle,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IFormationDoctoranle>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IFormationDoctoranle[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addFormationDoctoranleToCollectionIfMissing(
    formationDoctoranleCollection: IFormationDoctoranle[],
    ...formationDoctoranlesToCheck: (IFormationDoctoranle | null | undefined)[]
  ): IFormationDoctoranle[] {
    const formationDoctoranles: IFormationDoctoranle[] = formationDoctoranlesToCheck.filter(isPresent);
    if (formationDoctoranles.length > 0) {
      const formationDoctoranleCollectionIdentifiers = formationDoctoranleCollection.map(
        formationDoctoranleItem => getFormationDoctoranleIdentifier(formationDoctoranleItem)!
      );
      const formationDoctoranlesToAdd = formationDoctoranles.filter(formationDoctoranleItem => {
        const formationDoctoranleIdentifier = getFormationDoctoranleIdentifier(formationDoctoranleItem);
        if (formationDoctoranleIdentifier == null || formationDoctoranleCollectionIdentifiers.includes(formationDoctoranleIdentifier)) {
          return false;
        }
        formationDoctoranleCollectionIdentifiers.push(formationDoctoranleIdentifier);
        return true;
      });
      return [...formationDoctoranlesToAdd, ...formationDoctoranleCollection];
    }
    return formationDoctoranleCollection;
  }
}
