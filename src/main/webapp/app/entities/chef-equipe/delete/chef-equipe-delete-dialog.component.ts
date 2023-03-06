import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IChefEquipe } from '../chef-equipe.model';
import { ChefEquipeService } from '../service/chef-equipe.service';

@Component({
  templateUrl: './chef-equipe-delete-dialog.component.html',
})
export class ChefEquipeDeleteDialogComponent {
  chefEquipe?: IChefEquipe;

  constructor(protected chefEquipeService: ChefEquipeService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.chefEquipeService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
