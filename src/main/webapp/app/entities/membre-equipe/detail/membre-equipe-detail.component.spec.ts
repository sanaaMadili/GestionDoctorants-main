import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MembreEquipeDetailComponent } from './membre-equipe-detail.component';

describe('MembreEquipe Management Detail Component', () => {
  let comp: MembreEquipeDetailComponent;
  let fixture: ComponentFixture<MembreEquipeDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MembreEquipeDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ membreEquipe: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(MembreEquipeDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(MembreEquipeDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load membreEquipe on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.membreEquipe).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
