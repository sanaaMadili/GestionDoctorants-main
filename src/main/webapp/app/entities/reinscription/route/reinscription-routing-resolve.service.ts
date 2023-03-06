import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IReinscription, Reinscription } from '../reinscription.model';
import { ReinscriptionService } from '../service/reinscription.service';

@Injectable({ providedIn: 'root' })
export class ReinscriptionRoutingResolveService implements Resolve<IReinscription> {
  constructor(protected service: ReinscriptionService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IReinscription> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((reinscription: HttpResponse<Reinscription>) => {
          if (reinscription.body) {
            return of(reinscription.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Reinscription());
  }
}
