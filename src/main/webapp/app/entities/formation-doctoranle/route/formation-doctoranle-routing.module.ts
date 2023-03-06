import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { FormationDoctoranleComponent } from '../list/formation-doctoranle.component';
import { FormationDoctoranleDetailComponent } from '../detail/formation-doctoranle-detail.component';
import { FormationDoctoranleUpdateComponent } from '../update/formation-doctoranle-update.component';
import { FormationDoctoranleRoutingResolveService } from './formation-doctoranle-routing-resolve.service';

const formationDoctoranleRoute: Routes = [
  {
    path: '',
    component: FormationDoctoranleComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FormationDoctoranleDetailComponent,
    resolve: {
      formationDoctoranle: FormationDoctoranleRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FormationDoctoranleUpdateComponent,
    resolve: {
      formationDoctoranle: FormationDoctoranleRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FormationDoctoranleUpdateComponent,
    resolve: {
      formationDoctoranle: FormationDoctoranleRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(formationDoctoranleRoute)],
  exports: [RouterModule],
})
export class FormationDoctoranleRoutingModule {}
