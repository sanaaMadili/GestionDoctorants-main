import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ChefLabComponent } from './list/chef-lab.component';
import { ChefLabDetailComponent } from './detail/chef-lab-detail.component';
import { ChefLabUpdateComponent } from './update/chef-lab-update.component';
import { ChefLabDeleteDialogComponent } from './delete/chef-lab-delete-dialog.component';
import { ChefLabRoutingModule } from './route/chef-lab-routing.module';

@NgModule({
  imports: [SharedModule, ChefLabRoutingModule],
  declarations: [ChefLabComponent, ChefLabDetailComponent, ChefLabUpdateComponent, ChefLabDeleteDialogComponent],
  entryComponents: [ChefLabDeleteDialogComponent],
})
export class ChefLabModule {}
