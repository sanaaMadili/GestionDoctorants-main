import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IExtraUser, getExtraUserIdentifier } from '../extra-user.model';

export type EntityResponseType = HttpResponse<IExtraUser>;
export type EntityArrayResponseType = HttpResponse<IExtraUser[]>;

@Injectable({ providedIn: 'root' })
export class ExtraUserService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/extra-users');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(extraUser: IExtraUser): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(extraUser);
    return this.http
      .post<IExtraUser>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(extraUser: IExtraUser): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(extraUser);
    return this.http
      .put<IExtraUser>(`${this.resourceUrl}/${getExtraUserIdentifier(extraUser) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(extraUser: IExtraUser): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(extraUser);
    return this.http
      .patch<IExtraUser>(`${this.resourceUrl}/${getExtraUserIdentifier(extraUser) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IExtraUser>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }
  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IExtraUser[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  querymembre(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IExtraUser[]>(this.resourceUrl+"/users", { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  query1(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IExtraUser[]>(this.resourceUrl+"/professeur", { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }



  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addExtraUserToCollectionIfMissing(
    extraUserCollection: IExtraUser[],
    ...extraUsersToCheck: (IExtraUser | null | undefined)[]
  ): IExtraUser[] {
    const extraUsers: IExtraUser[] = extraUsersToCheck.filter(isPresent);
    if (extraUsers.length > 0) {
      const extraUserCollectionIdentifiers = extraUserCollection.map(extraUserItem => getExtraUserIdentifier(extraUserItem)!);
      const extraUsersToAdd = extraUsers.filter(extraUserItem => {
        const extraUserIdentifier = getExtraUserIdentifier(extraUserItem);
        if (extraUserIdentifier == null || extraUserCollectionIdentifiers.includes(extraUserIdentifier)) {
          return false;
        }
        extraUserCollectionIdentifiers.push(extraUserIdentifier);
        return true;
      });
      return [...extraUsersToAdd, ...extraUserCollection];
    }
    return extraUserCollection;
  }

  protected convertDateFromClient(extraUser: IExtraUser): IExtraUser {
    return Object.assign({}, extraUser, {
      dateNaissance: extraUser.dateNaissance?.isValid() ? extraUser.dateNaissance.toJSON() : undefined,
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
      res.body.forEach((extraUser: IExtraUser) => {
        extraUser.dateNaissance = extraUser.dateNaissance ? dayjs(extraUser.dateNaissance) : undefined;
      });
    }
    return res;
  }
}
