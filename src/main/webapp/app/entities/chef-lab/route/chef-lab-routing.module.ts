import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ChefLabComponent } from '../list/chef-lab.component';
import { ChefLabDetailComponent } from '../detail/chef-lab-detail.component';
import { ChefLabUpdateComponent } from '../update/chef-lab-update.component';
import { ChefLabRoutingResolveService } from './chef-lab-routing-resolve.service';

const chefLabRoute: Routes = [
  {
    path: '',
    component: ChefLabComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ChefLabDetailComponent,
    resolve: {
      chefLab: ChefLabRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ChefLabUpdateComponent,
    resolve: {
      chefLab: ChefLabRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ChefLabUpdateComponent,
    resolve: {
      chefLab: ChefLabRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(chefLabRoute)],
  exports: [RouterModule],
})
export class ChefLabRoutingModule {}
