import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { RouterModule } from '@angular/router';
import { LottiePlayer } from '@lottiefiles/lottie-player';

import { SharedModule } from 'app/shared/shared.module';
import {HOME_ROUTE} from './home.route';
import { HomeComponent } from './home.component';
import {InformationModule} from "../entities/information/information.module";

@NgModule({
  imports: [SharedModule, RouterModule.forChild([HOME_ROUTE]), InformationModule],
  declarations: [HomeComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Needed for Lottie Player

})
export class HomeModule {
  private ref = LottiePlayer;
}
