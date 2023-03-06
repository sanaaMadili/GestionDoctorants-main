import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { LaboratoireComponent } from '../list/laboratoire.component';
import { LaboratoireDetailComponent } from '../detail/laboratoire-detail.component';
import { LaboratoireUpdateComponent } from '../update/laboratoire-update.component';
import { LaboratoireRoutingResolveService } from './laboratoire-routing-resolve.service';

const laboratoireRoute: Routes = [
  {
    path: '',
    component: LaboratoireComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: LaboratoireDetailComponent,
    resolve: {
      laboratoire: LaboratoireRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: LaboratoireUpdateComponent,
    resolve: {
      laboratoire: LaboratoireRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: LaboratoireUpdateComponent,
    resolve: {
      laboratoire: LaboratoireRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(laboratoireRoute)],
  exports: [RouterModule],
})
export class LaboratoireRoutingModule {}
