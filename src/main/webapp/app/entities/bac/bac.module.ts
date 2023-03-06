import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { BacComponent } from './list/bac.component';
import { BacDetailComponent } from './detail/bac-detail.component';
import { BacUpdateComponent } from './update/bac-update.component';
import { BacDeleteDialogComponent } from './delete/bac-delete-dialog.component';
import { BacRoutingModule } from './route/bac-routing.module';
import {MatStepperModule} from "@angular/material/stepper";

@NgModule({
    imports: [SharedModule, BacRoutingModule, MatStepperModule],
    declarations: [BacComponent, BacDetailComponent, BacUpdateComponent, BacDeleteDialogComponent],
    entryComponents: [BacDeleteDialogComponent],
    exports: [
        BacUpdateComponent
    ]
})
export class BacModule {}
