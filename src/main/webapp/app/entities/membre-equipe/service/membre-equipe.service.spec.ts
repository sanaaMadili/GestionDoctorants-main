import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IMembreEquipe, MembreEquipe } from '../membre-equipe.model';

import { MembreEquipeService } from './membre-equipe.service';

describe('MembreEquipe Service', () => {
  let service: MembreEquipeService;
  let httpMock: HttpTestingController;
  let elemDefault: IMembreEquipe;
  let expectedResult: IMembreEquipe | IMembreEquipe[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(MembreEquipeService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      dateDebut: currentDate,
      datefin: currentDate,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          dateDebut: currentDate.format(DATE_FORMAT),
          datefin: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a MembreEquipe', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          dateDebut: currentDate.format(DATE_FORMAT),
          datefin: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateDebut: currentDate,
          datefin: currentDate,
        },
        returnedFromService
      );

      service.create(new MembreEquipe()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a MembreEquipe', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          dateDebut: currentDate.format(DATE_FORMAT),
          datefin: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateDebut: currentDate,
          datefin: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a MembreEquipe', () => {
      const patchObject = Object.assign(
        {
          dateDebut: currentDate.format(DATE_FORMAT),
          datefin: currentDate.format(DATE_FORMAT),
        },
        new MembreEquipe()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          dateDebut: currentDate,
          datefin: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of MembreEquipe', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          dateDebut: currentDate.format(DATE_FORMAT),
          datefin: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateDebut: currentDate,
          datefin: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a MembreEquipe', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addMembreEquipeToCollectionIfMissing', () => {
      it('should add a MembreEquipe to an empty array', () => {
        const membreEquipe: IMembreEquipe = { id: 123 };
        expectedResult = service.addMembreEquipeToCollectionIfMissing([], membreEquipe);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(membreEquipe);
      });

      it('should not add a MembreEquipe to an array that contains it', () => {
        const membreEquipe: IMembreEquipe = { id: 123 };
        const membreEquipeCollection: IMembreEquipe[] = [
          {
            ...membreEquipe,
          },
          { id: 456 },
        ];
        expectedResult = service.addMembreEquipeToCollectionIfMissing(membreEquipeCollection, membreEquipe);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a MembreEquipe to an array that doesn't contain it", () => {
        const membreEquipe: IMembreEquipe = { id: 123 };
        const membreEquipeCollection: IMembreEquipe[] = [{ id: 456 }];
        expectedResult = service.addMembreEquipeToCollectionIfMissing(membreEquipeCollection, membreEquipe);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(membreEquipe);
      });

      it('should add only unique MembreEquipe to an array', () => {
        const membreEquipeArray: IMembreEquipe[] = [{ id: 123 }, { id: 456 }, { id: 75845 }];
        const membreEquipeCollection: IMembreEquipe[] = [{ id: 123 }];
        expectedResult = service.addMembreEquipeToCollectionIfMissing(membreEquipeCollection, ...membreEquipeArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const membreEquipe: IMembreEquipe = { id: 123 };
        const membreEquipe2: IMembreEquipe = { id: 456 };
        expectedResult = service.addMembreEquipeToCollectionIfMissing([], membreEquipe, membreEquipe2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(membreEquipe);
        expect(expectedResult).toContain(membreEquipe2);
      });

      it('should accept null and undefined values', () => {
        const membreEquipe: IMembreEquipe = { id: 123 };
        expectedResult = service.addMembreEquipeToCollectionIfMissing([], null, membreEquipe, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(membreEquipe);
      });

      it('should return initial array if no MembreEquipe is added', () => {
        const membreEquipeCollection: IMembreEquipe[] = [{ id: 123 }];
        expectedResult = service.addMembreEquipeToCollectionIfMissing(membreEquipeCollection, undefined, null);
        expect(expectedResult).toEqual(membreEquipeCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
