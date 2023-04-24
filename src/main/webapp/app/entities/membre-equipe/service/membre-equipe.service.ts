import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMembreEquipe, getMembreEquipeIdentifier } from '../membre-equipe.model';

export type EntityResponseType = HttpResponse<IMembreEquipe>;
export type EntityArrayResponseType = HttpResponse<IMembreEquipe[]>;

@Injectable({ providedIn: 'root' })
export class MembreEquipeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/membre-equipes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(membreEquipe: IMembreEquipe): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(membreEquipe);
    return this.http
      .post<IMembreEquipe>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(membreEquipe: IMembreEquipe): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(membreEquipe);
    return this.http
      .put<IMembreEquipe>(`${this.resourceUrl}/${getMembreEquipeIdentifier(membreEquipe) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(membreEquipe: IMembreEquipe): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(membreEquipe);
    return this.http
      .patch<IMembreEquipe>(`${this.resourceUrl}/${getMembreEquipeIdentifier(membreEquipe) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IMembreEquipe>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }
  updatedate(id: number): Observable<any> {
    return this.http
      .patch<number>(`${this.resourceUrl}/${id}/updatedate`,id, { observe: 'response' })
      .pipe(map((res: any) => this.convertDateFromServer(res)));
  }
  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IMembreEquipe[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }
  querym(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IMembreEquipe[]>(this.resourceUrl+"/m", { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addMembreEquipeToCollectionIfMissing(
    membreEquipeCollection: IMembreEquipe[],
    ...membreEquipesToCheck: (IMembreEquipe | null | undefined)[]
  ): IMembreEquipe[] {
    const membreEquipes: IMembreEquipe[] = membreEquipesToCheck.filter(isPresent);
    if (membreEquipes.length > 0) {
      const membreEquipeCollectionIdentifiers = membreEquipeCollection.map(
        membreEquipeItem => getMembreEquipeIdentifier(membreEquipeItem)!
      );
      const membreEquipesToAdd = membreEquipes.filter(membreEquipeItem => {
        const membreEquipeIdentifier = getMembreEquipeIdentifier(membreEquipeItem);
        if (membreEquipeIdentifier == null || membreEquipeCollectionIdentifiers.includes(membreEquipeIdentifier)) {
          return false;
        }
        membreEquipeCollectionIdentifiers.push(membreEquipeIdentifier);
        return true;
      });
      return [...membreEquipesToAdd, ...membreEquipeCollection];
    }
    return membreEquipeCollection;
  }

  protected convertDateFromClient(membreEquipe: IMembreEquipe): IMembreEquipe {
    return Object.assign({}, membreEquipe, {
      dateDebut: membreEquipe.dateDebut?.isValid() ? membreEquipe.dateDebut.format(DATE_FORMAT) : undefined,
      datefin: membreEquipe.datefin?.isValid() ? membreEquipe.datefin.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dateDebut = res.body.dateDebut ? dayjs(res.body.dateDebut) : undefined;
      res.body.datefin = res.body.datefin ? dayjs(res.body.datefin) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((membreEquipe: IMembreEquipe) => {
        membreEquipe.dateDebut = membreEquipe.dateDebut ? dayjs(membreEquipe.dateDebut) : undefined;
        membreEquipe.datefin = membreEquipe.datefin ? dayjs(membreEquipe.datefin) : undefined;
      });
    }
    return res;
  }
}
