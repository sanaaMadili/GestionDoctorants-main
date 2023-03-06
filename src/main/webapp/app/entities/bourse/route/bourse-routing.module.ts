import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { BourseComponent } from '../list/bourse.component';
import { BourseDetailComponent } from '../detail/bourse-detail.component';
import { BourseUpdateComponent } from '../update/bourse-update.component';
import { BourseRoutingResolveService } from './bourse-routing-resolve.service';

const bourseRoute: Routes = [
  {
    path: '',
    component: BourseComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BourseDetailComponent,
    resolve: {
      bourse: BourseRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BourseUpdateComponent,
    resolve: {
      bourse: BourseRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BourseUpdateComponent,
    resolve: {
      bourse: BourseRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(bourseRoute)],
  exports: [RouterModule],
})
export class BourseRoutingModule {}
