import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { DiplomesComponent } from './list/diplomes.component';
import { DiplomesDetailComponent } from './detail/diplomes-detail.component';
import { DiplomesUpdateComponent } from './update/diplomes-update.component';
import { DiplomesRoutingModule } from './route/diplomes-routing.module';
import {FormationDoctorantModule} from "../formation-doctorant/formation-doctorant.module";
import {NgWizardModule} from "ng-wizard";
import {MatStepperModule} from "@angular/material/stepper";
import {MatIconModule} from "@angular/material/icon";
import {BacModule} from "../bac/bac.module";

@NgModule({
    imports: [SharedModule, DiplomesRoutingModule, FormationDoctorantModule, NgWizardModule, MatStepperModule, MatIconModule, BacModule],
  declarations: [DiplomesComponent, DiplomesDetailComponent, DiplomesUpdateComponent],
})
export class DiplomesModule {}
