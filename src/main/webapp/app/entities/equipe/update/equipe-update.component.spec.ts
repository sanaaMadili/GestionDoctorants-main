import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { EquipeService } from '../service/equipe.service';
import { IEquipe, Equipe } from '../equipe.model';
import { ILaboratoire } from 'app/entities/laboratoire/laboratoire.model';
import { LaboratoireService } from 'app/entities/laboratoire/service/laboratoire.service';

import { EquipeUpdateComponent } from './equipe-update.component';

describe('Equipe Management Update Component', () => {
  let comp: EquipeUpdateComponent;
  let fixture: ComponentFixture<EquipeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let equipeService: EquipeService;
  let laboratoireService: LaboratoireService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [EquipeUpdateComponent],
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
      .overrideTemplate(EquipeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EquipeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    equipeService = TestBed.inject(EquipeService);
    laboratoireService = TestBed.inject(LaboratoireService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Laboratoire query and add missing value', () => {
      const equipe: IEquipe = { id: 456 };
      const laboratoire: ILaboratoire = { id: 91251 };
      equipe.laboratoire = laboratoire;

      const laboratoireCollection: ILaboratoire[] = [{ id: 67464 }];
      jest.spyOn(laboratoireService, 'query').mockReturnValue(of(new HttpResponse({ body: laboratoireCollection })));
      const additionalLaboratoires = [laboratoire];
      const expectedCollection: ILaboratoire[] = [...additionalLaboratoires, ...laboratoireCollection];
      jest.spyOn(laboratoireService, 'addLaboratoireToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ equipe });
      comp.ngOnInit();

      expect(laboratoireService.query).toHaveBeenCalled();
      expect(laboratoireService.addLaboratoireToCollectionIfMissing).toHaveBeenCalledWith(laboratoireCollection, ...additionalLaboratoires);
      expect(comp.laboratoiresSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const equipe: IEquipe = { id: 456 };
      const laboratoire: ILaboratoire = { id: 66359 };
      equipe.laboratoire = laboratoire;

      activatedRoute.data = of({ equipe });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(equipe));
      expect(comp.laboratoiresSharedCollection).toContain(laboratoire);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Equipe>>();
      const equipe = { id: 123 };
      jest.spyOn(equipeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ equipe });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: equipe }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(equipeService.update).toHaveBeenCalledWith(equipe);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Equipe>>();
      const equipe = new Equipe();
      jest.spyOn(equipeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ equipe });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: equipe }));
      saveSubject.complete();

      // THEN
      expect(equipeService.create).toHaveBeenCalledWith(equipe);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Equipe>>();
      const equipe = { id: 123 };
      jest.spyOn(equipeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ equipe });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(equipeService.update).toHaveBeenCalledWith(equipe);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackLaboratoireById', () => {
      it('Should return tracked Laboratoire primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackLaboratoireById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
