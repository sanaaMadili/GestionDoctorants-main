import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDoctorant, getDoctorantIdentifier } from '../doctorant.model';
import {DoctorantSalariee2} from "../../ChartsModels/DoctorantSalariee2";
import {CountDoc} from "../../ChartsModels/CountDoc";

export type EntityResponseType = HttpResponse<IDoctorant>;
export type EntityArrayResponseType = HttpResponse<IDoctorant[]>;

@Injectable({ providedIn: 'root' })
export class DoctorantService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/doctorants');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(doctorant: IDoctorant): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(doctorant);
    return this.http
      .post<IDoctorant>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(doctorant: IDoctorant): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(doctorant);
    return this.http
      .put<IDoctorant>(`${this.resourceUrl}/${getDoctorantIdentifier(doctorant) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(doctorant: IDoctorant): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(doctorant);
    return this.http
      .patch<IDoctorant>(`${this.resourceUrl}/${getDoctorantIdentifier(doctorant) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IDoctorant>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  findActiveUser(): Observable<EntityResponseType> {
    return this.http
      .get<IDoctorant>(`${this.resourceUrl}/this`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IDoctorant[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
  countSalariee(): Observable<HttpResponse<DoctorantSalariee2[]>> {
    return this.http.get<DoctorantSalariee2[]>(`${this.resourceUrl}/countSalaririee`, { observe: 'response' });
  }
  countByAnnee(): Observable<HttpResponse<CountDoc[]>> {
    return this.http.get<CountDoc[]>(`${this.resourceUrl}/countDoc`, { observe: 'response' });
  }
  reinscription(): Observable<HttpResponse<number>> {
     return this.http.get<number>(`${this.resourceUrl}/reinscription`, { observe: 'response' });
  }

  Docotorantbyuser(id : number):Observable<EntityArrayResponseType> {
    return this.http.get<IDoctorant[]>(`${this.resourceUrl}/doctorant/${id}`, { observe: 'response' });
  }
  addDoctorantToCollectionIfMissing(
    doctorantCollection: IDoctorant[],
    ...doctorantsToCheck: (IDoctorant | null | undefined)[]
  ): IDoctorant[] {
    const doctorants: IDoctorant[] = doctorantsToCheck.filter(isPresent);
    if (doctorants.length > 0) {
      const doctorantCollectionIdentifiers = doctorantCollection.map(doctorantItem => getDoctorantIdentifier(doctorantItem)!);
      const doctorantsToAdd = doctorants.filter(doctorantItem => {
        const doctorantIdentifier = getDoctorantIdentifier(doctorantItem);
        if (doctorantIdentifier == null || doctorantCollectionIdentifiers.includes(doctorantIdentifier)) {
          return false;
        }
        doctorantCollectionIdentifiers.push(doctorantIdentifier);
        return true;
      });
      return [...doctorantsToAdd, ...doctorantCollection];
    }
    return doctorantCollection;
  }

  protected convertDateFromClient(doctorant: IDoctorant): IDoctorant {
    return Object.assign({}, doctorant, {
      dateNaissance: doctorant.dateNaissance?.isValid() ? doctorant.dateNaissance.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dateNaissance = res.body.dateNaissance ? dayjs(res.body.dateNaissance) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((doctorant: IDoctorant) => {
        doctorant.dateNaissance = doctorant.dateNaissance ? dayjs(doctorant.dateNaissance) : undefined;
      });
    }
    return res;
  }
}
