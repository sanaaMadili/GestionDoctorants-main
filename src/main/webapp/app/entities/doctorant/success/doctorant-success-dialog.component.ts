import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IDoctorant } from '../doctorant.model';
import { DoctorantService } from '../service/doctorant.service';

@Component({
  templateUrl: './doctorant-success-dialog.component.html',
})
export class DoctorantSuccessDialogComponent {
  doctorant?: IDoctorant;

  constructor(protected doctorantService: DoctorantService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }


}
