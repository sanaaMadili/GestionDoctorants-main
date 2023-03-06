import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFormationSuivie, getFormationSuivieIdentifier } from '../formation-suivie.model';
import {CountPubByType} from "../../ChartsModels/CountPubByType";

export type EntityResponseType = HttpResponse<IFormationSuivie>;
export type EntityArrayResponseType = HttpResponse<IFormationSuivie[]>;

@Injectable({ providedIn: 'root' })
export class FormationSuivieService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/formation-suivies');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(formationSuivie: IFormationSuivie): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(formationSuivie);
    return this.http
      .post<IFormationSuivie>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(formationSuivie: IFormationSuivie): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(formationSuivie);
    return this.http
      .put<IFormationSuivie>(`${this.resourceUrl}/${getFormationSuivieIdentifier(formationSuivie) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(formationSuivie: IFormationSuivie): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(formationSuivie);
    return this.http
      .patch<IFormationSuivie>(`${this.resourceUrl}/${getFormationSuivieIdentifier(formationSuivie) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IFormationSuivie>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IFormationSuivie[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }
  findbydoc(login: string): Observable<EntityArrayResponseType> {
    return this.http
      .get<IFormationSuivie[]>(`${this.resourceUrl}/doctorant/${login}`, {  observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }
  findbyThis(): Observable<EntityArrayResponseType> {
    return this.http
      .get<IFormationSuivie[]>(`${this.resourceUrl}/doctorant/this`, {  observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }
  Countduree(login: string): Observable<HttpResponse<number>> {
    return this.http
      .get<number>(`${this.resourceUrl}/duree/${login}`, {  observe: 'response' });
  }
  Dureepartheme(login: string):Observable<HttpResponse<CountPubByType[]>> {
  return this.http.get<CountPubByType[]>(`${this.resourceUrl}/Dureepartheme/${login}`, { observe: 'response' });
}

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addFormationSuivieToCollectionIfMissing(
    formationSuivieCollection: IFormationSuivie[],
    ...formationSuiviesToCheck: (IFormationSuivie | null | undefined)[]
  ): IFormationSuivie[] {
    const formationSuivies: IFormationSuivie[] = formationSuiviesToCheck.filter(isPresent);
    if (formationSuivies.length > 0) {
      const formationSuivieCollectionIdentifiers = formationSuivieCollection.map(
        formationSuivieItem => getFormationSuivieIdentifier(formationSuivieItem)!
      );
      const formationSuiviesToAdd = formationSuivies.filter(formationSuivieItem => {
        const formationSuivieIdentifier = getFormationSuivieIdentifier(formationSuivieItem);
        if (formationSuivieIdentifier == null || formationSuivieCollectionIdentifiers.includes(formationSuivieIdentifier)) {
          return false;
        }
        formationSuivieCollectionIdentifiers.push(formationSuivieIdentifier);
        return true;
      });
      return [...formationSuiviesToAdd, ...formationSuivieCollection];
    }
    return formationSuivieCollection;
  }

  protected convertDateFromClient(formationSuivie: IFormationSuivie): IFormationSuivie {
    return Object.assign({}, formationSuivie, {
      date: formationSuivie.date?.isValid() ? formationSuivie.date.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.date = res.body.date ? dayjs(res.body.date) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((formationSuivie: IFormationSuivie) => {
        formationSuivie.date = formationSuivie.date ? dayjs(formationSuivie.date) : undefined;
      });
    }
    return res;
  }
}
