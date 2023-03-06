import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IEquipe } from '../equipe.model';
import { EquipeService } from '../service/equipe.service';

@Component({
  templateUrl: './equipe-delete-dialog.component.html',
})
export class EquipeDeleteDialogComponent {
  equipe?: IEquipe;

  constructor(protected equipeService: EquipeService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.equipeService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
