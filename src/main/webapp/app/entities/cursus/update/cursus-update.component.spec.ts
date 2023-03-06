import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CursusService } from '../service/cursus.service';
import { ICursus, Cursus } from '../cursus.model';

import { CursusUpdateComponent } from './cursus-update.component';

describe('Cursus Management Update Component', () => {
  let comp: CursusUpdateComponent;
  let fixture: ComponentFixture<CursusUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let cursusService: CursusService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CursusUpdateComponent],
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
      .overrideTemplate(CursusUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CursusUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    cursusService = TestBed.inject(CursusService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const cursus: ICursus = { id: 456 };

      activatedRoute.data = of({ cursus });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(cursus));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Cursus>>();
      const cursus = { id: 123 };
      jest.spyOn(cursusService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ cursus });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: cursus }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(cursusService.update).toHaveBeenCalledWith(cursus);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Cursus>>();
      const cursus = new Cursus();
      jest.spyOn(cursusService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ cursus });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: cursus }));
      saveSubject.complete();

      // THEN
      expect(cursusService.create).toHaveBeenCalledWith(cursus);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Cursus>>();
      const cursus = { id: 123 };
      jest.spyOn(cursusService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ cursus });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(cursusService.update).toHaveBeenCalledWith(cursus);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
