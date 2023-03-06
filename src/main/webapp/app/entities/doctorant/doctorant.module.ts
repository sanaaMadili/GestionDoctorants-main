import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { DoctorantComponent } from './list/doctorant.component';
import { DoctorantDetailComponent } from './detail/doctorant-detail.component';
import { DoctorantUpdateComponent } from './update/doctorant-update.component';
import { DoctorantDeleteDialogComponent } from './delete/doctorant-delete-dialog.component';
import { DoctorantRoutingModule } from './route/doctorant-routing.module';
import {InformationModule} from "../information/information.module";
import {DataTablesModule} from "angular-datatables";
import {DoctorantSuccessDialogComponent} from "./success/doctorant-success-dialog.component";

@NgModule({
    imports: [SharedModule, DoctorantRoutingModule, InformationModule, DataTablesModule],
  declarations: [DoctorantComponent, DoctorantDetailComponent, DoctorantUpdateComponent, DoctorantDeleteDialogComponent,DoctorantSuccessDialogComponent],
  entryComponents: [DoctorantDeleteDialogComponent,DoctorantSuccessDialogComponent],
})
export class DoctorantModule {}
