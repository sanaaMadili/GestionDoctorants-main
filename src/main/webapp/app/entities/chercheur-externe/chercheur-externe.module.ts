import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ChercheurExterneComponent } from './list/chercheur-externe.component';
import { ChercheurExterneDetailComponent } from './detail/chercheur-externe-detail.component';
import { ChercheurExterneUpdateComponent } from './update/chercheur-externe-update.component';
import { ChercheurExterneDeleteDialogComponent } from './delete/chercheur-externe-delete-dialog.component';
import { ChercheurExterneRoutingModule } from './route/chercheur-externe-routing.module';

@NgModule({
    imports: [SharedModule, ChercheurExterneRoutingModule],
    declarations: [
        ChercheurExterneComponent,
        ChercheurExterneDetailComponent,
        ChercheurExterneUpdateComponent,
        ChercheurExterneDeleteDialogComponent,
    ],
    entryComponents: [ChercheurExterneDeleteDialogComponent],
  exports: [
    ChercheurExterneUpdateComponent,
    ChercheurExterneUpdateComponent,
    ChercheurExterneUpdateComponent,
    ChercheurExterneUpdateComponent,
    ChercheurExterneUpdateComponent
  ]
})
export class ChercheurExterneModule {}
