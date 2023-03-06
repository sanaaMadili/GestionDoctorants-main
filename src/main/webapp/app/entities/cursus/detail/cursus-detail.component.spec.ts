import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CursusDetailComponent } from './cursus-detail.component';

describe('Cursus Management Detail Component', () => {
  let comp: CursusDetailComponent;
  let fixture: ComponentFixture<CursusDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CursusDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ cursus: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(CursusDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(CursusDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load cursus on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.cursus).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
