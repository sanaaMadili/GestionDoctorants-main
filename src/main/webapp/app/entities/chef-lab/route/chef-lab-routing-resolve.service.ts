import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IChefLab, ChefLab } from '../chef-lab.model';
import { ChefLabService } from '../service/chef-lab.service';

@Injectable({ providedIn: 'root' })
export class ChefLabRoutingResolveService implements Resolve<IChefLab> {
  constructor(protected service: ChefLabService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IChefLab> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((chefLab: HttpResponse<ChefLab>) => {
          if (chefLab.body) {
            return of(chefLab.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ChefLab());
  }
}
