import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISujet } from '../sujet.model';
import { SujetService } from '../service/sujet.service';

@Component({
  templateUrl: './sujet-delete-dialog.component.html',
})
export class SujetDeleteDialogComponent {
  sujet?: ISujet;

  constructor(protected sujetService: SujetService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.sujetService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
