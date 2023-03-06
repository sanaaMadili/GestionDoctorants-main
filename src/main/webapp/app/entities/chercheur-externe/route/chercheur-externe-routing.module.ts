import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ChercheurExterneComponent } from '../list/chercheur-externe.component';
import { ChercheurExterneDetailComponent } from '../detail/chercheur-externe-detail.component';
import { ChercheurExterneUpdateComponent } from '../update/chercheur-externe-update.component';
import { ChercheurExterneRoutingResolveService } from './chercheur-externe-routing-resolve.service';

const chercheurExterneRoute: Routes = [
  {
    path: '',
    component: ChercheurExterneComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ChercheurExterneDetailComponent,
    resolve: {
      chercheurExterne: ChercheurExterneRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ChercheurExterneUpdateComponent,
    resolve: {
      chercheurExterne: ChercheurExterneRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ChercheurExterneUpdateComponent,
    resolve: {
      chercheurExterne: ChercheurExterneRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(chercheurExterneRoute)],
  exports: [RouterModule],
})
export class ChercheurExterneRoutingModule {}
