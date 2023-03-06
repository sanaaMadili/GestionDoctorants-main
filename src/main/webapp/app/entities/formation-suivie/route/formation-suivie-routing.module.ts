import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { FormationSuivieComponent } from '../list/formation-suivie.component';
import { FormationSuivieDetailComponent } from '../detail/formation-suivie-detail.component';
import { FormationSuivieUpdateComponent } from '../update/formation-suivie-update.component';
import { FormationSuivieRoutingResolveService } from './formation-suivie-routing-resolve.service';

const formationSuivieRoute: Routes = [
  {
    path: '',
    component: FormationSuivieComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FormationSuivieDetailComponent,
    resolve: {
      formationSuivie: FormationSuivieRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FormationSuivieUpdateComponent,
    resolve: {
      formationSuivie: FormationSuivieRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FormationSuivieUpdateComponent,
    resolve: {
      formationSuivie: FormationSuivieRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(formationSuivieRoute)],
  exports: [RouterModule],
})
export class FormationSuivieRoutingModule {}
