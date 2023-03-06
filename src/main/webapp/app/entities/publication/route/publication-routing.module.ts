import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PublicationComponent } from '../list/publication.component';
import { PublicationDetailComponent } from '../detail/publication-detail.component';
import { PublicationUpdateComponent } from '../update/publication-update.component';
import { PublicationRoutingResolveService } from './publication-routing-resolve.service';

const publicationRoute: Routes = [
  {
    path: '',
    component: PublicationComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PublicationDetailComponent,
    resolve: {
      publication: PublicationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PublicationUpdateComponent,
    resolve: {
      publication: PublicationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PublicationUpdateComponent,
    resolve: {
      publication: PublicationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(publicationRoute)],
  exports: [RouterModule],
})
export class PublicationRoutingModule {}
