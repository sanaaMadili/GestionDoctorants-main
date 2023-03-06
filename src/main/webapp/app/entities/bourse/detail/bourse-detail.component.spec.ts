import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BourseDetailComponent } from './bourse-detail.component';

describe('Bourse Management Detail Component', () => {
  let comp: BourseDetailComponent;
  let fixture: ComponentFixture<BourseDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BourseDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ bourse: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(BourseDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(BourseDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load bourse on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.bourse).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
