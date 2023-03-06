import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IFormationSuivie, FormationSuivie } from '../formation-suivie.model';

import { FormationSuivieService } from './formation-suivie.service';

describe('FormationSuivie Service', () => {
  let service: FormationSuivieService;
  let httpMock: HttpTestingController;
  let elemDefault: IFormationSuivie;
  let expectedResult: IFormationSuivie | IFormationSuivie[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(FormationSuivieService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      duree: 0,
      attestationContentType: 'image/png',
      attestation: 'AAAAAAA',
      date: currentDate,
      titre: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          date: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a FormationSuivie', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          date: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          date: currentDate,
        },
        returnedFromService
      );

      service.create(new FormationSuivie()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a FormationSuivie', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          duree: 1,
          attestation: 'BBBBBB',
          date: currentDate.format(DATE_FORMAT),
          titre: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          date: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a FormationSuivie', () => {
      const patchObject = Object.assign(
        {
          attestation: 'BBBBBB',
          titre: 'BBBBBB',
        },
        new FormationSuivie()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          date: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of FormationSuivie', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          duree: 1,
          attestation: 'BBBBBB',
          date: currentDate.format(DATE_FORMAT),
          titre: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          date: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a FormationSuivie', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addFormationSuivieToCollectionIfMissing', () => {
      it('should add a FormationSuivie to an empty array', () => {
        const formationSuivie: IFormationSuivie = { id: 123 };
        expectedResult = service.addFormationSuivieToCollectionIfMissing([], formationSuivie);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(formationSuivie);
      });

      it('should not add a FormationSuivie to an array that contains it', () => {
        const formationSuivie: IFormationSuivie = { id: 123 };
        const formationSuivieCollection: IFormationSuivie[] = [
          {
            ...formationSuivie,
          },
          { id: 456 },
        ];
        expectedResult = service.addFormationSuivieToCollectionIfMissing(formationSuivieCollection, formationSuivie);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a FormationSuivie to an array that doesn't contain it", () => {
        const formationSuivie: IFormationSuivie = { id: 123 };
        const formationSuivieCollection: IFormationSuivie[] = [{ id: 456 }];
        expectedResult = service.addFormationSuivieToCollectionIfMissing(formationSuivieCollection, formationSuivie);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(formationSuivie);
      });

      it('should add only unique FormationSuivie to an array', () => {
        const formationSuivieArray: IFormationSuivie[] = [{ id: 123 }, { id: 456 }, { id: 99481 }];
        const formationSuivieCollection: IFormationSuivie[] = [{ id: 123 }];
        expectedResult = service.addFormationSuivieToCollectionIfMissing(formationSuivieCollection, ...formationSuivieArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const formationSuivie: IFormationSuivie = { id: 123 };
        const formationSuivie2: IFormationSuivie = { id: 456 };
        expectedResult = service.addFormationSuivieToCollectionIfMissing([], formationSuivie, formationSuivie2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(formationSuivie);
        expect(expectedResult).toContain(formationSuivie2);
      });

      it('should accept null and undefined values', () => {
        const formationSuivie: IFormationSuivie = { id: 123 };
        expectedResult = service.addFormationSuivieToCollectionIfMissing([], null, formationSuivie, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(formationSuivie);
      });

      it('should return initial array if no FormationSuivie is added', () => {
        const formationSuivieCollection: IFormationSuivie[] = [{ id: 123 }];
        expectedResult = service.addFormationSuivieToCollectionIfMissing(formationSuivieCollection, undefined, null);
        expect(expectedResult).toEqual(formationSuivieCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
