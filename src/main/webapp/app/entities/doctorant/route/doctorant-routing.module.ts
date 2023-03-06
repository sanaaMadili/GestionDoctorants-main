import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { DoctorantComponent } from '../list/doctorant.component';
import { DoctorantDetailComponent } from '../detail/doctorant-detail.component';
import { DoctorantUpdateComponent } from '../update/doctorant-update.component';
import { DoctorantRoutingResolveService } from './doctorant-routing-resolve.service';

const doctorantRoute: Routes = [
  {
    path: '',
    component: DoctorantComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DoctorantDetailComponent,
    resolve: {
      doctorant: DoctorantRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DoctorantUpdateComponent,
    resolve: {
      doctorant: DoctorantRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DoctorantUpdateComponent,
    resolve: {
      doctorant: DoctorantRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(doctorantRoute)],
  exports: [RouterModule],
})
export class DoctorantRoutingModule {}
