import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IChefLab, getChefLabIdentifier } from '../chef-lab.model';

export type EntityResponseType = HttpResponse<IChefLab>;
export type EntityArrayResponseType = HttpResponse<IChefLab[]>;

@Injectable({ providedIn: 'root' })
export class ChefLabService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/chef-labs');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(chefLab: IChefLab): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(chefLab);
    return this.http
      .post<IChefLab>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(chefLab: IChefLab): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(chefLab);
    return this.http
      .put<IChefLab>(`${this.resourceUrl}/${getChefLabIdentifier(chefLab) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(chefLab: IChefLab): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(chefLab);
    return this.http
      .patch<IChefLab>(`${this.resourceUrl}/${getChefLabIdentifier(chefLab) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IChefLab>(`${this.resourceUrl}/${id}`, { observe: 'response' })
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
      .get<IChefLab[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addChefLabToCollectionIfMissing(chefLabCollection: IChefLab[], ...chefLabsToCheck: (IChefLab | null | undefined)[]): IChefLab[] {
    const chefLabs: IChefLab[] = chefLabsToCheck.filter(isPresent);
    if (chefLabs.length > 0) {
      const chefLabCollectionIdentifiers = chefLabCollection.map(chefLabItem => getChefLabIdentifier(chefLabItem)!);
      const chefLabsToAdd = chefLabs.filter(chefLabItem => {
        const chefLabIdentifier = getChefLabIdentifier(chefLabItem);
        if (chefLabIdentifier == null || chefLabCollectionIdentifiers.includes(chefLabIdentifier)) {
          return false;
        }
        chefLabCollectionIdentifiers.push(chefLabIdentifier);
        return true;
      });
      return [...chefLabsToAdd, ...chefLabCollection];
    }
    return chefLabCollection;
  }

  protected convertDateFromClient(chefLab: IChefLab): IChefLab {
    return Object.assign({}, chefLab, {
      dateDebut: chefLab.dateDebut?.isValid() ? chefLab.dateDebut.format(DATE_FORMAT) : undefined,
      dateFin: chefLab.dateFin?.isValid() ? chefLab.dateFin.format(DATE_FORMAT) : undefined,
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
      res.body.forEach((chefLab: IChefLab) => {
        chefLab.dateDebut = chefLab.dateDebut ? dayjs(chefLab.dateDebut) : undefined;
        chefLab.dateFin = chefLab.dateFin ? dayjs(chefLab.dateFin) : undefined;
      });
    }
    return res;
  }
}
