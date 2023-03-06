import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IInformation, Information } from '../information.model';
import { InformationService } from '../service/information.service';

@Injectable({ providedIn: 'root' })
export class InformationRoutingResolveService implements Resolve<IInformation> {
  constructor(protected service: InformationService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IInformation> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((information: HttpResponse<Information>) => {
          if (information.body) {
            return of(information.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Information());
  }
}
