import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISujet, Sujet } from '../sujet.model';
import { SujetService } from '../service/sujet.service';

@Injectable({ providedIn: 'root' })
export class SujetRoutingResolveService implements Resolve<ISujet> {
  constructor(protected service: SujetService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISujet> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((sujet: HttpResponse<Sujet>) => {
          if (sujet.body) {
            return of(sujet.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Sujet());
  }
}
