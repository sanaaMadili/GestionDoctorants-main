import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CursusComponent } from './list/cursus.component';
import { CursusDetailComponent } from './detail/cursus-detail.component';
import { CursusUpdateComponent } from './update/cursus-update.component';
import { CursusDeleteDialogComponent } from './delete/cursus-delete-dialog.component';
import { CursusRoutingModule } from './route/cursus-routing.module';

@NgModule({
    imports: [SharedModule, CursusRoutingModule],
    declarations: [CursusComponent, CursusDetailComponent, CursusUpdateComponent, CursusDeleteDialogComponent],
    entryComponents: [CursusDeleteDialogComponent],
    exports: [
        CursusDetailComponent
    ]
})
export class CursusModule {}
