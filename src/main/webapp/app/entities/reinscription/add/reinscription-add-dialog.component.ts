import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IReinscription } from '../reinscription.model';
import { ReinscriptionService } from '../service/reinscription.service';

@Component({
  templateUrl: './reinscription-add-dialog.component.html',
})
export class ReinscriptionAddDialogComponent {
  reinscription?: IReinscription;

  constructor(protected reinscriptionService: ReinscriptionService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }


}
