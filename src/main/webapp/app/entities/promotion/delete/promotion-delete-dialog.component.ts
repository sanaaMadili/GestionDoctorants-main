import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPromotion } from '../promotion.model';
import { PromotionService } from '../service/promotion.service';

@Component({
  templateUrl: './promotion-delete-dialog.component.html',
})
export class PromotionDeleteDialogComponent {
  promotion?: IPromotion;

  constructor(protected promotionService: PromotionService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.promotionService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
