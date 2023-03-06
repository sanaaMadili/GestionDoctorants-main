import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICursus, Cursus } from '../cursus.model';
import { CursusService } from '../service/cursus.service';

@Injectable({ providedIn: 'root' })
export class CursusRoutingResolveService implements Resolve<ICursus> {
  constructor(protected service: CursusService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICursus> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((cursus: HttpResponse<Cursus>) => {
          if (cursus.body) {
            return of(cursus.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Cursus());
  }
}
