import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { InformationDetailComponent } from './information-detail.component';

describe('Information Management Detail Component', () => {
  let comp: InformationDetailComponent;
  let fixture: ComponentFixture<InformationDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InformationDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ information: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(InformationDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(InformationDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load information on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.information).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
