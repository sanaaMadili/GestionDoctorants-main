import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPublication, Publication } from '../publication.model';
import { PublicationService } from '../service/publication.service';

@Injectable({ providedIn: 'root' })
export class PublicationRoutingResolveService implements Resolve<IPublication> {
  constructor(protected service: PublicationService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPublication> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((publication: HttpResponse<Publication>) => {
          if (publication.body) {
            return of(publication.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Publication());
  }
}
