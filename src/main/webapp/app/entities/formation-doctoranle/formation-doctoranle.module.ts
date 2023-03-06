import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { FormationDoctoranleComponent } from './list/formation-doctoranle.component';
import { FormationDoctoranleDetailComponent } from './detail/formation-doctoranle-detail.component';
import { FormationDoctoranleUpdateComponent } from './update/formation-doctoranle-update.component';
import { FormationDoctoranleDeleteDialogComponent } from './delete/formation-doctoranle-delete-dialog.component';
import { FormationDoctoranleRoutingModule } from './route/formation-doctoranle-routing.module';

@NgModule({
  imports: [SharedModule, FormationDoctoranleRoutingModule],
  declarations: [
    FormationDoctoranleComponent,
    FormationDoctoranleDetailComponent,
    FormationDoctoranleUpdateComponent,
    FormationDoctoranleDeleteDialogComponent,
  ],
  entryComponents: [FormationDoctoranleDeleteDialogComponent],
})
export class FormationDoctoranleModule {}
