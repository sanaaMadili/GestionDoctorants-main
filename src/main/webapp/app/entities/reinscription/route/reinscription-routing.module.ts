import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ReinscriptionComponent } from '../list/reinscription.component';
import { ReinscriptionDetailComponent } from '../detail/reinscription-detail.component';
import { ReinscriptionUpdateComponent } from '../update/reinscription-update.component';
import { ReinscriptionRoutingResolveService } from './reinscription-routing-resolve.service';

const reinscriptionRoute: Routes = [
  {
    path: '',
    component: ReinscriptionComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ReinscriptionDetailComponent,
    resolve: {
      reinscription: ReinscriptionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ReinscriptionUpdateComponent,
    resolve: {
      reinscription: ReinscriptionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ReinscriptionUpdateComponent,
    resolve: {
      reinscription: ReinscriptionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(reinscriptionRoute)],
  exports: [RouterModule],
})
export class ReinscriptionRoutingModule {}
