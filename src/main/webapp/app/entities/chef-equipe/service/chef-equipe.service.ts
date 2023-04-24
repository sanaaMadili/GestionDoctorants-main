import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IChefEquipe, getChefEquipeIdentifier } from '../chef-equipe.model';

export type EntityResponseType = HttpResponse<IChefEquipe>;
export type EntityArrayResponseType = HttpResponse<IChefEquipe[]>;

@Injectable({ providedIn: 'root' })
export class ChefEquipeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/chef-equipes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(chefEquipe: IChefEquipe): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(chefEquipe);
    return this.http
      .post<IChefEquipe>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(chefEquipe: IChefEquipe): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(chefEquipe);
    return this.http
      .put<IChefEquipe>(`${this.resourceUrl}/${getChefEquipeIdentifier(chefEquipe) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }
  updatedate(id: number): Observable<any> {
    return this.http
      .patch<number>(`${this.resourceUrl}/${id}/updatedate`,id, { observe: 'response' })
      .pipe(map((res: any) => this.convertDateFromServer(res)));
  }
  queryparuser(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IChefEquipe[]>(this.resourceUrl+"/paruser", { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }


  partialUpdate(chefEquipe: IChefEquipe): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(chefEquipe);
    return this.http
      .patch<IChefEquipe>(`${this.resourceUrl}/${getChefEquipeIdentifier(chefEquipe) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IChefEquipe>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IChefEquipe[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addChefEquipeToCollectionIfMissing(
    chefEquipeCollection: IChefEquipe[],
    ...chefEquipesToCheck: (IChefEquipe | null | undefined)[]
  ): IChefEquipe[] {
    const chefEquipes: IChefEquipe[] = chefEquipesToCheck.filter(isPresent);
    if (chefEquipes.length > 0) {
      const chefEquipeCollectionIdentifiers = chefEquipeCollection.map(chefEquipeItem => getChefEquipeIdentifier(chefEquipeItem)!);
      const chefEquipesToAdd = chefEquipes.filter(chefEquipeItem => {
        const chefEquipeIdentifier = getChefEquipeIdentifier(chefEquipeItem);
        if (chefEquipeIdentifier == null || chefEquipeCollectionIdentifiers.includes(chefEquipeIdentifier)) {
          return false;
        }
        chefEquipeCollectionIdentifiers.push(chefEquipeIdentifier);
        return true;
      });
      return [...chefEquipesToAdd, ...chefEquipeCollection];
    }
    return chefEquipeCollection;
  }

  protected convertDateFromClient(chefEquipe: IChefEquipe): IChefEquipe {
    return Object.assign({}, chefEquipe, {
      dateDebut: chefEquipe.dateDebut?.isValid() ? chefEquipe.dateDebut.format(DATE_FORMAT) : undefined,
      dateFin: chefEquipe.dateFin?.isValid() ? chefEquipe.dateFin.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dateDebut = res.body.dateDebut ? dayjs(res.body.dateDebut) : undefined;
      res.body.dateFin = res.body.dateFin ? dayjs(res.body.dateFin) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((chefEquipe: IChefEquipe) => {
        chefEquipe.dateDebut = chefEquipe.dateDebut ? dayjs(chefEquipe.dateDebut) : undefined;
        chefEquipe.dateFin = chefEquipe.dateFin ? dayjs(chefEquipe.dateFin) : undefined;
      });
    }
    return res;
  }
}
