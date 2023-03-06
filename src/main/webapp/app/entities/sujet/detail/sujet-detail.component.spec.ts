import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SujetDetailComponent } from './sujet-detail.component';

describe('Sujet Management Detail Component', () => {
  let comp: SujetDetailComponent;
  let fixture: ComponentFixture<SujetDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SujetDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ sujet: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(SujetDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(SujetDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load sujet on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.sujet).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
