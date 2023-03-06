import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { FormationDoctoranleDetailComponent } from './formation-doctoranle-detail.component';

describe('FormationDoctoranle Management Detail Component', () => {
  let comp: FormationDoctoranleDetailComponent;
  let fixture: ComponentFixture<FormationDoctoranleDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormationDoctoranleDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ formationDoctoranle: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(FormationDoctoranleDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(FormationDoctoranleDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load formationDoctoranle on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.formationDoctoranle).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
