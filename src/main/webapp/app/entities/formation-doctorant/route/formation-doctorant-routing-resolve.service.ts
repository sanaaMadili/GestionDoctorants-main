import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IFormationDoctorant, FormationDoctorant } from '../formation-doctorant.model';
import { FormationDoctorantService } from '../service/formation-doctorant.service';

@Injectable({ providedIn: 'root' })
export class FormationDoctorantRoutingResolveService implements Resolve<IFormationDoctorant> {
  constructor(protected service: FormationDoctorantService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IFormationDoctorant> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((formationDoctorant: HttpResponse<FormationDoctorant>) => {
          if (formationDoctorant.body) {
            return of(formationDoctorant.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new FormationDoctorant());
  }
}
