import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IChercheurExterne, ChercheurExterne } from '../chercheur-externe.model';
import { ChercheurExterneService } from '../service/chercheur-externe.service';

@Injectable({ providedIn: 'root' })
export class ChercheurExterneRoutingResolveService implements Resolve<IChercheurExterne> {
  constructor(protected service: ChercheurExterneService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IChercheurExterne> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((chercheurExterne: HttpResponse<ChercheurExterne>) => {
          if (chercheurExterne.body) {
            return of(chercheurExterne.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ChercheurExterne());
  }
}
