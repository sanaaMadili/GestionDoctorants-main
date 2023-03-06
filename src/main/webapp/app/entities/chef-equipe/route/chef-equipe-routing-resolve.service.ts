import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IChefEquipe, ChefEquipe } from '../chef-equipe.model';
import { ChefEquipeService } from '../service/chef-equipe.service';

@Injectable({ providedIn: 'root' })
export class ChefEquipeRoutingResolveService implements Resolve<IChefEquipe> {
  constructor(protected service: ChefEquipeService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IChefEquipe> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((chefEquipe: HttpResponse<ChefEquipe>) => {
          if (chefEquipe.body) {
            return of(chefEquipe.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ChefEquipe());
  }
}
