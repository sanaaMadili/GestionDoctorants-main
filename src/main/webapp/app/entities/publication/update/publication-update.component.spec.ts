import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PublicationService } from '../service/publication.service';
import { IPublication, Publication } from '../publication.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IChercheurExterne } from 'app/entities/chercheur-externe/chercheur-externe.model';
import { ChercheurExterneService } from 'app/entities/chercheur-externe/service/chercheur-externe.service';

import { PublicationUpdateComponent } from './publication-update.component';

describe('Publication Management Update Component', () => {
  let comp: PublicationUpdateComponent;
  let fixture: ComponentFixture<PublicationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let publicationService: PublicationService;
  let userService: UserService;
  let chercheurExterneService: ChercheurExterneService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PublicationUpdateComponent],
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
      .overrideTemplate(PublicationUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PublicationUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    publicationService = TestBed.inject(PublicationService);
    userService = TestBed.inject(UserService);
    chercheurExterneService = TestBed.inject(ChercheurExterneService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const publication: IPublication = { id: 456 };
      const chercheurs: IUser[] = [{ id: 46332 }];
      publication.chercheurs = chercheurs;
      const user: IUser = { id: 9629 };
      publication.user = user;

      const userCollection: IUser[] = [{ id: 17160 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [...chercheurs, user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ publication });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call ChercheurExterne query and add missing value', () => {
      const publication: IPublication = { id: 456 };
      const chercheurExternes: IChercheurExterne[] = [{ id: 83945 }];
      publication.chercheurExternes = chercheurExternes;

      const chercheurExterneCollection: IChercheurExterne[] = [{ id: 9064 }];
      jest.spyOn(chercheurExterneService, 'query').mockReturnValue(of(new HttpResponse({ body: chercheurExterneCollection })));
      const additionalChercheurExternes = [...chercheurExternes];
      const expectedCollection: IChercheurExterne[] = [...additionalChercheurExternes, ...chercheurExterneCollection];
      jest.spyOn(chercheurExterneService, 'addChercheurExterneToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ publication });
      comp.ngOnInit();

      expect(chercheurExterneService.query).toHaveBeenCalled();
      expect(chercheurExterneService.addChercheurExterneToCollectionIfMissing).toHaveBeenCalledWith(
        chercheurExterneCollection,
        ...additionalChercheurExternes
      );
      expect(comp.chercheurExternesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const publication: IPublication = { id: 456 };
      const chercheurs: IUser = { id: 35129 };
      publication.chercheurs = [chercheurs];
      const user: IUser = { id: 49241 };
      publication.user = user;
      const chercheurExternes: IChercheurExterne = { id: 31088 };
      publication.chercheurExternes = [chercheurExternes];

      activatedRoute.data = of({ publication });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(publication));
      expect(comp.usersSharedCollection).toContain(chercheurs);
      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.chercheurExternesSharedCollection).toContain(chercheurExternes);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Publication>>();
      const publication = { id: 123 };
      jest.spyOn(publicationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ publication });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: publication }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(publicationService.update).toHaveBeenCalledWith(publication);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Publication>>();
      const publication = new Publication();
      jest.spyOn(publicationService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ publication });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: publication }));
      saveSubject.complete();

      // THEN
      expect(publicationService.create).toHaveBeenCalledWith(publication);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Publication>>();
      const publication = { id: 123 };
      jest.spyOn(publicationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ publication });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(publicationService.update).toHaveBeenCalledWith(publication);
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

    describe('trackChercheurExterneById', () => {
      it('Should return tracked ChercheurExterne primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackChercheurExterneById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });

  describe('Getting selected relationships', () => {
    describe('getSelectedUser', () => {
      it('Should return option if no User is selected', () => {
        const option = { id: 123 };
        const result = comp.getSelectedUser(option);
        expect(result === option).toEqual(true);
      });

      it('Should return selected User for according option', () => {
        const option = { id: 123 };
        const selected = { id: 123 };
        const selected2 = { id: 456 };
        const result = comp.getSelectedUser(option, [selected2, selected]);
        expect(result === selected).toEqual(true);
        expect(result === selected2).toEqual(false);
        expect(result === option).toEqual(false);
      });

      it('Should return option if this User is not selected', () => {
        const option = { id: 123 };
        const selected = { id: 456 };
        const result = comp.getSelectedUser(option, [selected]);
        expect(result === option).toEqual(true);
        expect(result === selected).toEqual(false);
      });
    });

    describe('getSelectedChercheurExterne', () => {
      it('Should return option if no ChercheurExterne is selected', () => {
        const option = { id: 123 };
        const result = comp.getSelectedChercheurExterne(option);
        expect(result === option).toEqual(true);
      });

      it('Should return selected ChercheurExterne for according option', () => {
        const option = { id: 123 };
        const selected = { id: 123 };
        const selected2 = { id: 456 };
        const result = comp.getSelectedChercheurExterne(option, [selected2, selected]);
        expect(result === selected).toEqual(true);
        expect(result === selected2).toEqual(false);
        expect(result === option).toEqual(false);
      });

      it('Should return option if this ChercheurExterne is not selected', () => {
        const option = { id: 123 };
        const selected = { id: 456 };
        const result = comp.getSelectedChercheurExterne(option, [selected]);
        expect(result === option).toEqual(true);
        expect(result === selected).toEqual(false);
      });
    });
  });
});
