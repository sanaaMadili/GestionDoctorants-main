import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IReinscription } from '../reinscription.model';
import { ReinscriptionService } from '../service/reinscription.service';

@Component({
  templateUrl: './reinscription-delete-dialog.component.html',
})
export class ReinscriptionDeleteDialogComponent {
  reinscription?: IReinscription;

  constructor(protected reinscriptionService: ReinscriptionService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.reinscriptionService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
