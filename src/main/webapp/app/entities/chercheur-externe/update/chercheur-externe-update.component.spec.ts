import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ChercheurExterneService } from '../service/chercheur-externe.service';
import { IChercheurExterne, ChercheurExterne } from '../chercheur-externe.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { ChercheurExterneUpdateComponent } from './chercheur-externe-update.component';

describe('ChercheurExterne Management Update Component', () => {
  let comp: ChercheurExterneUpdateComponent;
  let fixture: ComponentFixture<ChercheurExterneUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let chercheurExterneService: ChercheurExterneService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ChercheurExterneUpdateComponent],
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
      .overrideTemplate(ChercheurExterneUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ChercheurExterneUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    chercheurExterneService = TestBed.inject(ChercheurExterneService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const chercheurExterne: IChercheurExterne = { id: 456 };
      const user: IUser = { id: 88067 };
      chercheurExterne.user = user;

      const userCollection: IUser[] = [{ id: 31786 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ chercheurExterne });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const chercheurExterne: IChercheurExterne = { id: 456 };
      const user: IUser = { id: 64526 };
      chercheurExterne.user = user;

      activatedRoute.data = of({ chercheurExterne });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(chercheurExterne));
      expect(comp.usersSharedCollection).toContain(user);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ChercheurExterne>>();
      const chercheurExterne = { id: 123 };
      jest.spyOn(chercheurExterneService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ chercheurExterne });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: chercheurExterne }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(chercheurExterneService.update).toHaveBeenCalledWith(chercheurExterne);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ChercheurExterne>>();
      const chercheurExterne = new ChercheurExterne();
      jest.spyOn(chercheurExterneService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ chercheurExterne });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: chercheurExterne }));
      saveSubject.complete();

      // THEN
      expect(chercheurExterneService.create).toHaveBeenCalledWith(chercheurExterne);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ChercheurExterne>>();
      const chercheurExterne = { id: 123 };
      jest.spyOn(chercheurExterneService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ chercheurExterne });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(chercheurExterneService.update).toHaveBeenCalledWith(chercheurExterne);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackUserById', () => {
      it('Should return tracked User primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackUserById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
