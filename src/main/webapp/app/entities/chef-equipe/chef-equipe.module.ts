import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ChefEquipeComponent } from './list/chef-equipe.component';
import { ChefEquipeDetailComponent } from './detail/chef-equipe-detail.component';
import { ChefEquipeUpdateComponent } from './update/chef-equipe-update.component';
import { ChefEquipeDeleteDialogComponent } from './delete/chef-equipe-delete-dialog.component';
import { ChefEquipeRoutingModule } from './route/chef-equipe-routing.module';

@NgModule({
  imports: [SharedModule, ChefEquipeRoutingModule],
  declarations: [ChefEquipeComponent, ChefEquipeDetailComponent, ChefEquipeUpdateComponent, ChefEquipeDeleteDialogComponent],
  entryComponents: [ChefEquipeDeleteDialogComponent],
  exports: [
    ChefEquipeUpdateComponent,
    ChefEquipeUpdateComponent,
    ChefEquipeUpdateComponent,
    ChefEquipeUpdateComponent,
    ChefEquipeUpdateComponent
  ]
})
export class ChefEquipeModule {}
