import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ILaboratoire, Laboratoire } from '../laboratoire.model';
import { LaboratoireService } from '../service/laboratoire.service';

@Injectable({ providedIn: 'root' })
export class LaboratoireRoutingResolveService implements Resolve<ILaboratoire> {
  constructor(protected service: LaboratoireService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ILaboratoire> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((laboratoire: HttpResponse<Laboratoire>) => {
          if (laboratoire.body) {
            return of(laboratoire.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Laboratoire());
  }
}
