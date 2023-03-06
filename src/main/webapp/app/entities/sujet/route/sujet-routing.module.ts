import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SujetComponent } from '../list/sujet.component';
import { SujetDetailComponent } from '../detail/sujet-detail.component';
import { SujetUpdateComponent } from '../update/sujet-update.component';
import { SujetRoutingResolveService } from './sujet-routing-resolve.service';

const sujetRoute: Routes = [
  {
    path: '',
    component: SujetComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SujetDetailComponent,
    resolve: {
      sujet: SujetRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SujetUpdateComponent,
    resolve: {
      sujet: SujetRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SujetUpdateComponent,
    resolve: {
      sujet: SujetRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(sujetRoute)],
  exports: [RouterModule],
})
export class SujetRoutingModule {}
