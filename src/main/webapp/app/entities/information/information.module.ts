import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { InformationComponent } from './list/information.component';
import { InformationDetailComponent } from './detail/information-detail.component';
import { InformationRoutingModule } from './route/information-routing.module';
import {ChartsModule} from "ng2-charts";
import { LottiePlayer } from '@lottiefiles/lottie-player';
import {MatExpansionModule} from "@angular/material/expansion";
import {MatCardModule} from "@angular/material/card";

@NgModule({
  imports: [SharedModule, InformationRoutingModule, ChartsModule, MatExpansionModule, MatCardModule],
    declarations: [InformationComponent, InformationDetailComponent],
  exports: [
    InformationComponent,
    InformationDetailComponent,
    InformationDetailComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Needed for Lottie Player

})
export class InformationModule {
  private ref = LottiePlayer;

}
