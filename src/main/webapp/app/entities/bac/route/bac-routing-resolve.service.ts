import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IBac, Bac } from '../bac.model';
import { BacService } from '../service/bac.service';

@Injectable({ providedIn: 'root' })
export class BacRoutingResolveService implements Resolve<IBac> {
  constructor(protected service: BacService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBac> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((bac: HttpResponse<Bac>) => {
          if (bac.body) {
            return of(bac.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }else{
      return this.service.findActive().pipe(
        mergeMap((bac: HttpResponse<Bac>) => {
          if (bac.body) {
            return of(bac.body);
          } else {
            return of(new Bac());
          }
        })
      );
    }
    return of(new Bac());
  }
}
