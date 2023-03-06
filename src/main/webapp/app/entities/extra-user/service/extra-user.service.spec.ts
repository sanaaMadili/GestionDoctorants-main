import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IExtraUser, ExtraUser } from '../extra-user.model';

import { ExtraUserService } from './extra-user.service';

describe('ExtraUser Service', () => {
  let service: ExtraUserService;
  let httpMock: HttpTestingController;
  let elemDefault: IExtraUser;
  let expectedResult: IExtraUser | IExtraUser[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ExtraUserService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      cin: 'AAAAAAA',
      dateNaissance: currentDate,
      lieuNaissance: 'AAAAAAA',
      nationalite: 'AAAAAAA',
      adresse: 'AAAAAAA',
      numeroTelephone: 0,
      genre: 'AAAAAAA',
      nomArabe: 'AAAAAAA',
      prnomArabe: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          dateNaissance: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a ExtraUser', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          dateNaissance: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateNaissance: currentDate,
        },
        returnedFromService
      );

      service.create(new ExtraUser()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ExtraUser', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          cin: 'BBBBBB',
          dateNaissance: currentDate.format(DATE_TIME_FORMAT),
          lieuNaissance: 'BBBBBB',
          nationalite: 'BBBBBB',
          adresse: 'BBBBBB',
          numeroTelephone: 1,
          genre: 'BBBBBB',
          nomArabe: 'BBBBBB',
          prnomArabe: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateNaissance: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ExtraUser', () => {
      const patchObject = Object.assign(
        {
          dateNaissance: currentDate.format(DATE_TIME_FORMAT),
          nationalite: 'BBBBBB',
          adresse: 'BBBBBB',
          numeroTelephone: 1,
        },
        new ExtraUser()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          dateNaissance: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ExtraUser', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          cin: 'BBBBBB',
          dateNaissance: currentDate.format(DATE_TIME_FORMAT),
          lieuNaissance: 'BBBBBB',
          nationalite: 'BBBBBB',
          adresse: 'BBBBBB',
          numeroTelephone: 1,
          genre: 'BBBBBB',
          nomArabe: 'BBBBBB',
          prnomArabe: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateNaissance: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a ExtraUser', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addExtraUserToCollectionIfMissing', () => {
      it('should add a ExtraUser to an empty array', () => {
        const extraUser: IExtraUser = { id: 123 };
        expectedResult = service.addExtraUserToCollectionIfMissing([], extraUser);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(extraUser);
      });

      it('should not add a ExtraUser to an array that contains it', () => {
        const extraUser: IExtraUser = { id: 123 };
        const extraUserCollection: IExtraUser[] = [
          {
            ...extraUser,
          },
          { id: 456 },
        ];
        expectedResult = service.addExtraUserToCollectionIfMissing(extraUserCollection, extraUser);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ExtraUser to an array that doesn't contain it", () => {
        const extraUser: IExtraUser = { id: 123 };
        const extraUserCollection: IExtraUser[] = [{ id: 456 }];
        expectedResult = service.addExtraUserToCollectionIfMissing(extraUserCollection, extraUser);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(extraUser);
      });

      it('should add only unique ExtraUser to an array', () => {
        const extraUserArray: IExtraUser[] = [{ id: 123 }, { id: 456 }, { id: 58639 }];
        const extraUserCollection: IExtraUser[] = [{ id: 123 }];
        expectedResult = service.addExtraUserToCollectionIfMissing(extraUserCollection, ...extraUserArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const extraUser: IExtraUser = { id: 123 };
        const extraUser2: IExtraUser = { id: 456 };
        expectedResult = service.addExtraUserToCollectionIfMissing([], extraUser, extraUser2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(extraUser);
        expect(expectedResult).toContain(extraUser2);
      });

      it('should accept null and undefined values', () => {
        const extraUser: IExtraUser = { id: 123 };
        expectedResult = service.addExtraUserToCollectionIfMissing([], null, extraUser, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(extraUser);
      });

      it('should return initial array if no ExtraUser is added', () => {
        const extraUserCollection: IExtraUser[] = [{ id: 123 }];
        expectedResult = service.addExtraUserToCollectionIfMissing(extraUserCollection, undefined, null);
        expect(expectedResult).toEqual(extraUserCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
