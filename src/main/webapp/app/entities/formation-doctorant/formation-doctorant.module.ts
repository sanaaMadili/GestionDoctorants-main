import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { FormationDoctorantComponent } from './list/formation-doctorant.component';
import { FormationDoctorantDetailComponent } from './detail/formation-doctorant-detail.component';
import { FormationDoctorantUpdateComponent } from './update/formation-doctorant-update.component';
import { FormationDoctorantDeleteDialogComponent } from './delete/formation-doctorant-delete-dialog.component';
import { FormationDoctorantRoutingModule } from './route/formation-doctorant-routing.module';
import {MatStepperModule} from "@angular/material/stepper";

@NgModule({
    imports: [SharedModule, FormationDoctorantRoutingModule, MatStepperModule],
    declarations: [
        FormationDoctorantComponent,
        FormationDoctorantDetailComponent,
        FormationDoctorantUpdateComponent,
        FormationDoctorantDeleteDialogComponent,
    ],
    entryComponents: [FormationDoctorantDeleteDialogComponent],
  exports: [
    FormationDoctorantComponent,
    FormationDoctorantUpdateComponent
  ]
})
export class FormationDoctorantModule {}
