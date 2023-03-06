import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ChefEquipeComponent } from '../list/chef-equipe.component';
import { ChefEquipeDetailComponent } from '../detail/chef-equipe-detail.component';
import { ChefEquipeUpdateComponent } from '../update/chef-equipe-update.component';
import { ChefEquipeRoutingResolveService } from './chef-equipe-routing-resolve.service';

const chefEquipeRoute: Routes = [
  {
    path: '',
    component: ChefEquipeComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ChefEquipeDetailComponent,
    resolve: {
      chefEquipe: ChefEquipeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ChefEquipeUpdateComponent,
    resolve: {
      chefEquipe: ChefEquipeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ChefEquipeUpdateComponent,
    resolve: {
      chefEquipe: ChefEquipeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(chefEquipeRoute)],
  exports: [RouterModule],
})
export class ChefEquipeRoutingModule {}
