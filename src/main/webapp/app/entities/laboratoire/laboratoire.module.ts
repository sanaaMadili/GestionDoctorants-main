import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { LaboratoireComponent } from './list/laboratoire.component';
import { LaboratoireDetailComponent } from './detail/laboratoire-detail.component';
import { LaboratoireUpdateComponent } from './update/laboratoire-update.component';
import { LaboratoireDeleteDialogComponent } from './delete/laboratoire-delete-dialog.component';
import { LaboratoireRoutingModule } from './route/laboratoire-routing.module';

@NgModule({
  imports: [SharedModule, LaboratoireRoutingModule],
  declarations: [LaboratoireComponent, LaboratoireDetailComponent, LaboratoireUpdateComponent, LaboratoireDeleteDialogComponent],
  entryComponents: [LaboratoireDeleteDialogComponent],
})
export class LaboratoireModule {}
