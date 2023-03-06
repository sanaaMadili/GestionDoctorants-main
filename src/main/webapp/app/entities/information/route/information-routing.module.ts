import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { InformationComponent } from '../list/information.component';
import { InformationDetailComponent } from '../detail/information-detail.component';
import { InformationRoutingResolveService } from './information-routing-resolve.service';

const informationRoute: Routes = [
  {
    path: 'aaa',
    component: InformationComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: '',
    component: InformationDetailComponent,
    resolve: {
      information: InformationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(informationRoute)],
  exports: [RouterModule],
})
export class InformationRoutingModule {}
