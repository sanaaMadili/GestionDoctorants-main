import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { MembreEquipeComponent } from './list/membre-equipe.component';
import { MembreEquipeDetailComponent } from './detail/membre-equipe-detail.component';
import { MembreEquipeUpdateComponent } from './update/membre-equipe-update.component';
import { MembreEquipeDeleteDialogComponent } from './delete/membre-equipe-delete-dialog.component';
import { MembreEquipeRoutingModule } from './route/membre-equipe-routing.module';
import { ChefEquipeModule } from "../chef-equipe/chef-equipe.module";

@NgModule({
    declarations: [MembreEquipeComponent, MembreEquipeDetailComponent, MembreEquipeUpdateComponent, MembreEquipeDeleteDialogComponent],
    entryComponents: [MembreEquipeDeleteDialogComponent],
    imports: [SharedModule, MembreEquipeRoutingModule, ChefEquipeModule]
})
export class MembreEquipeModule {}
