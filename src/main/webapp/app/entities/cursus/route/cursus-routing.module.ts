import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CursusComponent } from '../list/cursus.component';
import { CursusDetailComponent } from '../detail/cursus-detail.component';
import { CursusUpdateComponent } from '../update/cursus-update.component';
import { CursusRoutingResolveService } from './cursus-routing-resolve.service';

const cursusRoute: Routes = [
  {
    path: '',
    component: CursusComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CursusDetailComponent,
    resolve: {
      cursus: CursusRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CursusUpdateComponent,
    resolve: {
      cursus: CursusRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CursusUpdateComponent,
    resolve: {
      cursus: CursusRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(cursusRoute)],
  exports: [RouterModule],
})
export class CursusRoutingModule {}
