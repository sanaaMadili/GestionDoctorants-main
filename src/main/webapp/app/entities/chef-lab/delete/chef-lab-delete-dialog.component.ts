import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IChefLab } from '../chef-lab.model';
import { ChefLabService } from '../service/chef-lab.service';

@Component({
  templateUrl: './chef-lab-delete-dialog.component.html',
})
export class ChefLabDeleteDialogComponent {
  chefLab?: IChefLab;

  constructor(protected chefLabService: ChefLabService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.chefLabService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
