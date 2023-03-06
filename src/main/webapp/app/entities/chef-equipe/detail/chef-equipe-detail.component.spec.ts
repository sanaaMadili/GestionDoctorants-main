import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ChefEquipeDetailComponent } from './chef-equipe-detail.component';

describe('ChefEquipe Management Detail Component', () => {
  let comp: ChefEquipeDetailComponent;
  let fixture: ComponentFixture<ChefEquipeDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChefEquipeDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ chefEquipe: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ChefEquipeDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ChefEquipeDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load chefEquipe on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.chefEquipe).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
