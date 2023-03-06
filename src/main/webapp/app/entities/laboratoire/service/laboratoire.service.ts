import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ILaboratoire, getLaboratoireIdentifier } from '../laboratoire.model';

export type EntityResponseType = HttpResponse<ILaboratoire>;
export type EntityArrayResponseType = HttpResponse<ILaboratoire[]>;

@Injectable({ providedIn: 'root' })
export class LaboratoireService {
  t:[] | undefined;
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/laboratoires');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(laboratoire: ILaboratoire): Observable<EntityResponseType> {
    return this.http.post<ILaboratoire>(this.resourceUrl, laboratoire, { observe: 'response' });
  }

  update(laboratoire: ILaboratoire): Observable<EntityResponseType> {
    return this.http.put<ILaboratoire>(`${this.resourceUrl}/${getLaboratoireIdentifier(laboratoire) as number}`, laboratoire, {
      observe: 'response',
    });
  }

  partialUpdate(laboratoire: ILaboratoire): Observable<EntityResponseType> {
    return this.http.patch<ILaboratoire>(`${this.resourceUrl}/${getLaboratoireIdentifier(laboratoire) as number}`, laboratoire, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ILaboratoire>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }



  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ILaboratoire[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  list(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ILaboratoire[]>(this.resourceUrl+"/list", { params: options, observe: 'response' });
  }


  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addLaboratoireToCollectionIfMissing(
    laboratoireCollection: ILaboratoire[],
    ...laboratoiresToCheck: (ILaboratoire | null | undefined)[]
  ): ILaboratoire[] {
    const laboratoires: ILaboratoire[] = laboratoiresToCheck.filter(isPresent);
    if (laboratoires.length > 0) {
      const laboratoireCollectionIdentifiers = laboratoireCollection.map(laboratoireItem => getLaboratoireIdentifier(laboratoireItem)!);
      const laboratoiresToAdd = laboratoires.filter(laboratoireItem => {
        const laboratoireIdentifier = getLaboratoireIdentifier(laboratoireItem);
        if (laboratoireIdentifier == null || laboratoireCollectionIdentifiers.includes(laboratoireIdentifier)) {
          return false;
        }
        laboratoireCollectionIdentifiers.push(laboratoireIdentifier);
        return true;
      });
      return [...laboratoiresToAdd, ...laboratoireCollection];
    }
    return laboratoireCollection;
  }
}
