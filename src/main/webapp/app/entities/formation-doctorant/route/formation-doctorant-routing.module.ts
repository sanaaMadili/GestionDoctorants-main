import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { FormationDoctorantComponent } from '../list/formation-doctorant.component';
import { FormationDoctorantDetailComponent } from '../detail/formation-doctorant-detail.component';
import { FormationDoctorantUpdateComponent } from '../update/formation-doctorant-update.component';
import { FormationDoctorantRoutingResolveService } from './formation-doctorant-routing-resolve.service';

const formationDoctorantRoute: Routes = [
  {
    path: '',
    component: FormationDoctorantComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FormationDoctorantDetailComponent,
    resolve: {
      formationDoctorant: FormationDoctorantRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FormationDoctorantUpdateComponent,
    resolve: {
      formationDoctorant: FormationDoctorantRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FormationDoctorantUpdateComponent,
    resolve: {
      formationDoctorant: FormationDoctorantRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(formationDoctorantRoute)],
  exports: [RouterModule],
})
export class FormationDoctorantRoutingModule {}
