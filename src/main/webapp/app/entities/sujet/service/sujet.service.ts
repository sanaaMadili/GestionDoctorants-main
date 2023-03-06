import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import {ISujet, getSujetIdentifier, Sujet} from '../sujet.model';
import {Encadrent} from "../../ChartsModels/Encadrent";

export type EntityResponseType = HttpResponse<ISujet>;
export type EntityArrayResponseType = HttpResponse<ISujet[]>;

@Injectable({ providedIn: 'root' })
export class SujetService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/sujets');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(sujet: ISujet): Observable<EntityResponseType> {
    return this.http.post<ISujet>(this.resourceUrl, sujet, { observe: 'response' });
  }

  update(sujet: ISujet): Observable<EntityResponseType> {
    return this.http.put<ISujet>(`${this.resourceUrl}/${getSujetIdentifier(sujet) as number}`, sujet, { observe: 'response' });
  }

  partialUpdate(sujet: ISujet): Observable<EntityResponseType> {
    return this.http.patch<ISujet>(`${this.resourceUrl}/${getSujetIdentifier(sujet) as number}`, sujet, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISujet>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISujet[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  query1(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISujet[]>(this.resourceUrl+"/faty", { params: options, observe: 'response' });
  }

  findLogin(login:string): Observable<HttpResponse<Encadrent>> {
    return this.http.get<Encadrent>(`${this.resourceUrl}/login/${login}`, { observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addSujetToCollectionIfMissing(sujetCollection: ISujet[], ...sujetsToCheck: (ISujet | null | undefined)[]): ISujet[] {
    const sujets: ISujet[] = sujetsToCheck.filter(isPresent);
    if (sujets.length > 0) {
      const sujetCollectionIdentifiers = sujetCollection.map(sujetItem => getSujetIdentifier(sujetItem)!);
      const sujetsToAdd = sujets.filter(sujetItem => {
        const sujetIdentifier = getSujetIdentifier(sujetItem);
        if (sujetIdentifier == null || sujetCollectionIdentifiers.includes(sujetIdentifier)) {
          return false;
        }
        sujetCollectionIdentifiers.push(sujetIdentifier);
        return true;
      });
      return [...sujetsToAdd, ...sujetCollection];
    }
    return sujetCollection;
  }
}
