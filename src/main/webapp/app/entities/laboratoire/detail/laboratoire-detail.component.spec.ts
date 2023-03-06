import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { LaboratoireDetailComponent } from './laboratoire-detail.component';

describe('Laboratoire Management Detail Component', () => {
  let comp: LaboratoireDetailComponent;
  let fixture: ComponentFixture<LaboratoireDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LaboratoireDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ laboratoire: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(LaboratoireDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(LaboratoireDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load laboratoire on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.laboratoire).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
