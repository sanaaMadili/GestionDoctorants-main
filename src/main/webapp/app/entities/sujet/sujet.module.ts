import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SujetComponent } from './list/sujet.component';
import { SujetDetailComponent } from './detail/sujet-detail.component';
import { SujetUpdateComponent } from './update/sujet-update.component';
import { SujetDeleteDialogComponent } from './delete/sujet-delete-dialog.component';
import { SujetRoutingModule } from './route/sujet-routing.module';

@NgModule({
  imports: [SharedModule, SujetRoutingModule],
  declarations: [SujetComponent, SujetDetailComponent, SujetUpdateComponent, SujetDeleteDialogComponent],
  entryComponents: [SujetDeleteDialogComponent],
})
export class SujetModule {}
