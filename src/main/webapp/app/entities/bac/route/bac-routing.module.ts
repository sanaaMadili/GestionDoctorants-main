import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { BacComponent } from '../list/bac.component';
import { BacDetailComponent } from '../detail/bac-detail.component';
import { BacUpdateComponent } from '../update/bac-update.component';
import { BacRoutingResolveService } from './bac-routing-resolve.service';

const bacRoute: Routes = [
  {
    path: '',
    component: BacComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BacDetailComponent,
    resolve: {
      bac: BacRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BacUpdateComponent,
    resolve: {
      bac: BacRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BacUpdateComponent,
    resolve: {
      bac: BacRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(bacRoute)],
  exports: [RouterModule],
})
export class BacRoutingModule {}
