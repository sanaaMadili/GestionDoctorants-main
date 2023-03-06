import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IChercheurExterne } from '../chercheur-externe.model';
import { ChercheurExterneService } from '../service/chercheur-externe.service';

@Component({
  templateUrl: './chercheur-externe-delete-dialog.component.html',
})
export class ChercheurExterneDeleteDialogComponent {
  chercheurExterne?: IChercheurExterne;

  constructor(protected chercheurExterneService: ChercheurExterneService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.chercheurExterneService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
