import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IInformation, getInformationIdentifier } from '../information.model';

export type EntityResponseType = HttpResponse<IInformation>;
export type EntityArrayResponseType = HttpResponse<IInformation[]>;

@Injectable({ providedIn: 'root' })
export class InformationService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/information');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IInformation>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IInformation[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  addInformationToCollectionIfMissing(
    informationCollection: IInformation[],
    ...informationToCheck: (IInformation | null | undefined)[]
  ): IInformation[] {
    const information: IInformation[] = informationToCheck.filter(isPresent);
    if (information.length > 0) {
      const informationCollectionIdentifiers = informationCollection.map(informationItem => getInformationIdentifier(informationItem)!);
      const informationToAdd = information.filter(informationItem => {
        const informationIdentifier = getInformationIdentifier(informationItem);
        if (informationIdentifier == null || informationCollectionIdentifiers.includes(informationIdentifier)) {
          return false;
        }
        informationCollectionIdentifiers.push(informationIdentifier);
        return true;
      });
      return [...informationToAdd, ...informationCollection];
    }
    return informationCollection;
  }
}
