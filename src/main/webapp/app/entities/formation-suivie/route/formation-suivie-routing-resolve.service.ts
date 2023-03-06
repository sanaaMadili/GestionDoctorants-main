import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IFormationSuivie, FormationSuivie } from '../formation-suivie.model';
import { FormationSuivieService } from '../service/formation-suivie.service';

@Injectable({ providedIn: 'root' })
export class FormationSuivieRoutingResolveService implements Resolve<IFormationSuivie> {
  constructor(protected service: FormationSuivieService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IFormationSuivie> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((formationSuivie: HttpResponse<FormationSuivie>) => {
          if (formationSuivie.body) {
            return of(formationSuivie.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new FormationSuivie());
  }
}
