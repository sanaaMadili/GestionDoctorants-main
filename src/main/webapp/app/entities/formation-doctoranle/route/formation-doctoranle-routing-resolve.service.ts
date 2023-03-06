import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IFormationDoctoranle, FormationDoctoranle } from '../formation-doctoranle.model';
import { FormationDoctoranleService } from '../service/formation-doctoranle.service';

@Injectable({ providedIn: 'root' })
export class FormationDoctoranleRoutingResolveService implements Resolve<IFormationDoctoranle> {
  constructor(protected service: FormationDoctoranleService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IFormationDoctoranle> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((formationDoctoranle: HttpResponse<FormationDoctoranle>) => {
          if (formationDoctoranle.body) {
            return of(formationDoctoranle.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new FormationDoctoranle());
  }
}
