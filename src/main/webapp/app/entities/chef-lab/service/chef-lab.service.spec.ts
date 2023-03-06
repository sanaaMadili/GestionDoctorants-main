import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IChefLab, ChefLab } from '../chef-lab.model';

import { ChefLabService } from './chef-lab.service';

describe('ChefLab Service', () => {
  let service: ChefLabService;
  let httpMock: HttpTestingController;
  let elemDefault: IChefLab;
  let expectedResult: IChefLab | IChefLab[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ChefLabService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      dateDebut: currentDate,
      dateFin: currentDate,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          dateDebut: currentDate.format(DATE_FORMAT),
          dateFin: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a ChefLab', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          dateDebut: currentDate.format(DATE_FORMAT),
          dateFin: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateDebut: currentDate,
          dateFin: currentDate,
        },
        returnedFromService
      );

      service.create(new ChefLab()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ChefLab', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          dateDebut: currentDate.format(DATE_FORMAT),
          dateFin: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateDebut: currentDate,
          dateFin: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ChefLab', () => {
      const patchObject = Object.assign(
        {
          dateDebut: currentDate.format(DATE_FORMAT),
        },
        new ChefLab()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          dateDebut: currentDate,
          dateFin: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ChefLab', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          dateDebut: currentDate.format(DATE_FORMAT),
          dateFin: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateDebut: currentDate,
          dateFin: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a ChefLab', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addChefLabToCollectionIfMissing', () => {
      it('should add a ChefLab to an empty array', () => {
        const chefLab: IChefLab = { id: 123 };
        expectedResult = service.addChefLabToCollectionIfMissing([], chefLab);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(chefLab);
      });

      it('should not add a ChefLab to an array that contains it', () => {
        const chefLab: IChefLab = { id: 123 };
        const chefLabCollection: IChefLab[] = [
          {
            ...chefLab,
          },
          { id: 456 },
        ];
        expectedResult = service.addChefLabToCollectionIfMissing(chefLabCollection, chefLab);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ChefLab to an array that doesn't contain it", () => {
        const chefLab: IChefLab = { id: 123 };
        const chefLabCollection: IChefLab[] = [{ id: 456 }];
        expectedResult = service.addChefLabToCollectionIfMissing(chefLabCollection, chefLab);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(chefLab);
      });

      it('should add only unique ChefLab to an array', () => {
        const chefLabArray: IChefLab[] = [{ id: 123 }, { id: 456 }, { id: 40192 }];
        const chefLabCollection: IChefLab[] = [{ id: 123 }];
        expectedResult = service.addChefLabToCollectionIfMissing(chefLabCollection, ...chefLabArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const chefLab: IChefLab = { id: 123 };
        const chefLab2: IChefLab = { id: 456 };
        expectedResult = service.addChefLabToCollectionIfMissing([], chefLab, chefLab2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(chefLab);
        expect(expectedResult).toContain(chefLab2);
      });

      it('should accept null and undefined values', () => {
        const chefLab: IChefLab = { id: 123 };
        expectedResult = service.addChefLabToCollectionIfMissing([], null, chefLab, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(chefLab);
      });

      it('should return initial array if no ChefLab is added', () => {
        const chefLabCollection: IChefLab[] = [{ id: 123 }];
        expectedResult = service.addChefLabToCollectionIfMissing(chefLabCollection, undefined, null);
        expect(expectedResult).toEqual(chefLabCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
