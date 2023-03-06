import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IBourse, Bourse } from '../bourse.model';
import { BourseService } from '../service/bourse.service';

@Injectable({ providedIn: 'root' })
export class BourseRoutingResolveService implements Resolve<IBourse> {
  constructor(protected service: BourseService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBourse> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((bourse: HttpResponse<Bourse>) => {
          if (bourse.body) {
            return of(bourse.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Bourse());
  }
}
