import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ChercheurExterneDetailComponent } from './chercheur-externe-detail.component';

describe('ChercheurExterne Management Detail Component', () => {
  let comp: ChercheurExterneDetailComponent;
  let fixture: ComponentFixture<ChercheurExterneDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChercheurExterneDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ chercheurExterne: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ChercheurExterneDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ChercheurExterneDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load chercheurExterne on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.chercheurExterne).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
