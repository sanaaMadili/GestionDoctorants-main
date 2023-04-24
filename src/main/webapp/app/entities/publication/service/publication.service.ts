import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPublication, getPublicationIdentifier } from '../publication.model';
import {CountPub} from "../../ChartsModels/CountPub";
import {CountPubByType} from "../../ChartsModels/CountPubByType";
import {CountCherchuerExterne} from "../../ChartsModels/CountCherchuerExterne";
import {CountPubByTypeAnnee} from "../../ChartsModels/CountPubByTypeAnnee";
import {CountChercheurPays} from "../../ChartsModels/CountChercheurPays";

export type EntityResponseType = HttpResponse<IPublication>;
export type EntityArrayResponseType = HttpResponse<IPublication[]>;

@Injectable({ providedIn: 'root' })
export class PublicationService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/publications');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(publication: IPublication): Observable<EntityResponseType> {
    return this.http.post<IPublication>(this.resourceUrl, publication, { observe: 'response' });
  }

  update(publication: IPublication): Observable<EntityResponseType> {
    return this.http.put<IPublication>(`${this.resourceUrl}/${getPublicationIdentifier(publication) as number}`, publication, {
      observe: 'response',
    });
  }

  partialUpdate(publication: IPublication): Observable<EntityResponseType> {
    return this.http.patch<IPublication>(`${this.resourceUrl}/${getPublicationIdentifier(publication) as number}`, publication, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPublication>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
  findByUser(id: number): Observable<EntityArrayResponseType> {
    return this.http.get<IPublication[]>(`${this.resourceUrl}/user/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPublication[]>(`${this.resourceUrl}`, { params: options, observe: 'response' });
  }
  publicationCurentUser(): Observable<EntityArrayResponseType> {
    return this.http.get<IPublication[]>(`${this.resourceUrl}/this`, { observe: 'response' });
  }


  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
  count():Observable<HttpResponse<CountPub[]>> {
    return this.http.get<CountPub[]>(`${this.resourceUrl}/count`, { observe: 'response' });
  }
  countbyUser(login :string):Observable<HttpResponse<CountPub[]>> {
    return this.http.get<CountPub[]>(`${this.resourceUrl}/count/${login}`, { observe: 'response' });
  }
  PublicationType():Observable<HttpResponse<string[]>> {
    return this.http.get<string[]>(`${this.resourceUrl}/type`, { observe: 'response' });
  }
  PublicationTypeByuser(login:string):Observable<HttpResponse<string[]>> {
    return this.http.get<string[]>(`${this.resourceUrl}/type/${login}`, { observe: 'response' });
  }
  Publicationbyuser(login:string):Observable<EntityArrayResponseType> {
    return this.http.get<IPublication[]>(`${this.resourceUrl}/pub/${login}`, { observe: 'response' });
  }
  countByUser(id: number):Observable<HttpResponse<CountPub[]>> {
    return this.http.get<CountPub[]>(`${this.resourceUrl}/count/id/${id}`, { observe: 'response' });
  }
  countAll():Observable<HttpResponse<CountPub[]>> {
    return this.http.get<CountPub[]>(`${this.resourceUrl}/countALL/`, { observe: 'response' });
  }
  countTypeCurentUser():Observable<HttpResponse<CountPubByType[]>> {
    return this.http.get<CountPubByType[]>(`${this.resourceUrl}/countType`, { observe: 'response' });
  }
  countTypeByUser(login: string):Observable<HttpResponse<CountPubByType[]>> {
    return this.http.get<CountPubByType[]>(`${this.resourceUrl}/countType/${login}`, { observe: 'response' });
  }
  countTypeAll():Observable<HttpResponse<CountPubByType[]>> {
    return this.http.get<CountPubByType[]>(`${this.resourceUrl}/countTypeALL/`, { observe: 'response' });
  }
  countChercheurExterne():Observable<HttpResponse<CountCherchuerExterne[]>> {
    return this.http.get<CountCherchuerExterne[]>(`${this.resourceUrl}/countTypeAndchercheur/`, { observe: 'response' });
  }
  countChercheurExterneByUser(login:string):Observable<HttpResponse<CountCherchuerExterne[]>> {
    return this.http.get<CountCherchuerExterne[]>(`${this.resourceUrl}/countTypeAndchercheur/${login}`, { observe: 'response' });
  }
  countPubByAnnee():Observable<HttpResponse<CountPubByTypeAnnee[]>> {
    return this.http.get<CountPubByTypeAnnee[]>(`${this.resourceUrl}/countTypeAndAnnee/`, { observe: 'response' });
  }
  countPubByAnneeByUser(login:string):Observable<HttpResponse<CountPubByTypeAnnee[]>> {
    return this.http.get<CountPubByTypeAnnee[]>(`${this.resourceUrl}/countTypeAndAnnee/${login}`, { observe: 'response' });
  }
  countAllPubByAnnee():Observable<HttpResponse<CountPubByTypeAnnee[]>> {
    return this.http.get<CountPubByTypeAnnee[]>(`${this.resourceUrl}/counAlltTypeAndAnnee/`, { observe: 'response' });
  }
  countchercheur():Observable<HttpResponse<CountChercheurPays[]>> {
    return this.http.get<CountChercheurPays[]>(`${this.resourceUrl}/countChercheurPays/`, { observe: 'response' });
  }

  addPublicationToCollectionIfMissing(
    publicationCollection: IPublication[],
    ...publicationsToCheck: (IPublication | null | undefined)[]
  ): IPublication[] {
    const publications: IPublication[] = publicationsToCheck.filter(isPresent);
    if (publications.length > 0) {
      const publicationCollectionIdentifiers = publicationCollection.map(publicationItem => getPublicationIdentifier(publicationItem)!);
      const publicationsToAdd = publications.filter(publicationItem => {
        const publicationIdentifier = getPublicationIdentifier(publicationItem);
        if (publicationIdentifier == null || publicationCollectionIdentifiers.includes(publicationIdentifier)) {
          return false;
        }
        publicationCollectionIdentifiers.push(publicationIdentifier);
        return true;
      });
      return [...publicationsToAdd, ...publicationCollection];
    }
    return publicationCollection;
  }
}
