import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { FormationDoctoranleService } from '../service/formation-doctoranle.service';
import { IFormationDoctoranle, FormationDoctoranle } from '../formation-doctoranle.model';

import { FormationDoctoranleUpdateComponent } from './formation-doctoranle-update.component';

describe('FormationDoctoranle Management Update Component', () => {
  let comp: FormationDoctoranleUpdateComponent;
  let fixture: ComponentFixture<FormationDoctoranleUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let formationDoctoranleService: FormationDoctoranleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [FormationDoctoranleUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(FormationDoctoranleUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FormationDoctoranleUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    formationDoctoranleService = TestBed.inject(FormationDoctoranleService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const formationDoctoranle: IFormationDoctoranle = { id: 456 };

      activatedRoute.data = of({ formationDoctoranle });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(formationDoctoranle));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<FormationDoctoranle>>();
      const formationDoctoranle = { id: 123 };
      jest.spyOn(formationDoctoranleService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ formationDoctoranle });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: formationDoctoranle }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(formationDoctoranleService.update).toHaveBeenCalledWith(formationDoctoranle);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<FormationDoctoranle>>();
      const formationDoctoranle = new FormationDoctoranle();
      jest.spyOn(formationDoctoranleService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ formationDoctoranle });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: formationDoctoranle }));
      saveSubject.complete();

      // THEN
      expect(formationDoctoranleService.create).toHaveBeenCalledWith(formationDoctoranle);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<FormationDoctoranle>>();
      const formationDoctoranle = { id: 123 };
      jest.spyOn(formationDoctoranleService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ formationDoctoranle });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(formationDoctoranleService.update).toHaveBeenCalledWith(formationDoctoranle);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
