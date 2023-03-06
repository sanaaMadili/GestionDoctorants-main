import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { FormationSuivieComponent } from './list/formation-suivie.component';
import { FormationSuivieDetailComponent } from './detail/formation-suivie-detail.component';
import { FormationSuivieUpdateComponent } from './update/formation-suivie-update.component';
import { FormationSuivieDeleteDialogComponent } from './delete/formation-suivie-delete-dialog.component';
import { FormationSuivieRoutingModule } from './route/formation-suivie-routing.module';

@NgModule({
  imports: [SharedModule, FormationSuivieRoutingModule],
  declarations: [
    FormationSuivieComponent,
    FormationSuivieDetailComponent,
    FormationSuivieUpdateComponent,
    FormationSuivieDeleteDialogComponent,
  ],
  entryComponents: [FormationSuivieDeleteDialogComponent],
})
export class FormationSuivieModule {}
