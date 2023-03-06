import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { BourseComponent } from './list/bourse.component';
import { BourseDetailComponent } from './detail/bourse-detail.component';
import { BourseUpdateComponent } from './update/bourse-update.component';
import { BourseDeleteDialogComponent } from './delete/bourse-delete-dialog.component';
import { BourseRoutingModule } from './route/bourse-routing.module';
import {BourseAddDialogComponent} from "./add/bourse-add-dialog.component";
import {DataTablesModule} from "angular-datatables";

@NgModule({
    imports: [SharedModule, BourseRoutingModule, DataTablesModule],
  declarations: [BourseComponent, BourseDetailComponent, BourseUpdateComponent, BourseDeleteDialogComponent,BourseAddDialogComponent],
  entryComponents: [BourseDeleteDialogComponent,BourseAddDialogComponent],
})
export class BourseModule {}
