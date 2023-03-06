import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ChefLabDetailComponent } from './chef-lab-detail.component';

describe('ChefLab Management Detail Component', () => {
  let comp: ChefLabDetailComponent;
  let fixture: ComponentFixture<ChefLabDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChefLabDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ chefLab: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ChefLabDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ChefLabDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load chefLab on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.chefLab).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
