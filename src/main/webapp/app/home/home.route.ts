import { Route } from '@angular/router';

import { HomeComponent } from './home.component';
import {InformationDetailComponent} from "../entities/information/detail/information-detail.component";

export const HOME_ROUTE: Route = {
  path: '',
  component: HomeComponent,
  data: {
    pageTitle: 'home.title'

  },
};
