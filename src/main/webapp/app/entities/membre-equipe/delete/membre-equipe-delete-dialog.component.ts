import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IMembreEquipe } from '../membre-equipe.model';
import { MembreEquipeService } from '../service/membre-equipe.service';

@Component({
  templateUrl: './membre-equipe-delete-dialog.component.html',
})
export class MembreEquipeDeleteDialogComponent {
  membreEquipe?: IMembreEquipe;

  constructor(protected membreEquipeService: MembreEquipeService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.membreEquipeService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
