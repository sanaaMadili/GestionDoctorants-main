import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IDoctorant, Doctorant } from '../doctorant.model';
import { DoctorantService } from '../service/doctorant.service';

@Injectable({ providedIn: 'root' })
export class DoctorantRoutingResolveService implements Resolve<IDoctorant> {
  constructor(protected service: DoctorantService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDoctorant> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((doctorant: HttpResponse<Doctorant>) => {
          if (doctorant.body) {
            return of(doctorant.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }else{
      return this.service.findActiveUser().pipe(
        mergeMap((doctorant: HttpResponse<Doctorant>) => {
          if (doctorant.body) {
            return of(doctorant.body);
          } else {
            return of(new Doctorant());
          }
        })
      );
    }
    return of(new Doctorant());
  }
}
