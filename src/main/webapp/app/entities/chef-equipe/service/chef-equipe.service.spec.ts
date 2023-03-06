import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IChefEquipe, ChefEquipe } from '../chef-equipe.model';

import { ChefEquipeService } from './chef-equipe.service';

describe('ChefEquipe Service', () => {
  let service: ChefEquipeService;
  let httpMock: HttpTestingController;
  let elemDefault: IChefEquipe;
  let expectedResult: IChefEquipe | IChefEquipe[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ChefEquipeService);
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

    it('should create a ChefEquipe', () => {
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

      service.create(new ChefEquipe()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ChefEquipe', () => {
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

    it('should partial update a ChefEquipe', () => {
      const patchObject = Object.assign({}, new ChefEquipe());

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

    it('should return a list of ChefEquipe', () => {
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

    it('should delete a ChefEquipe', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addChefEquipeToCollectionIfMissing', () => {
      it('should add a ChefEquipe to an empty array', () => {
        const chefEquipe: IChefEquipe = { id: 123 };
        expectedResult = service.addChefEquipeToCollectionIfMissing([], chefEquipe);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(chefEquipe);
      });

      it('should not add a ChefEquipe to an array that contains it', () => {
        const chefEquipe: IChefEquipe = { id: 123 };
        const chefEquipeCollection: IChefEquipe[] = [
          {
            ...chefEquipe,
          },
          { id: 456 },
        ];
        expectedResult = service.addChefEquipeToCollectionIfMissing(chefEquipeCollection, chefEquipe);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ChefEquipe to an array that doesn't contain it", () => {
        const chefEquipe: IChefEquipe = { id: 123 };
        const chefEquipeCollection: IChefEquipe[] = [{ id: 456 }];
        expectedResult = service.addChefEquipeToCollectionIfMissing(chefEquipeCollection, chefEquipe);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(chefEquipe);
      });

      it('should add only unique ChefEquipe to an array', () => {
        const chefEquipeArray: IChefEquipe[] = [{ id: 123 }, { id: 456 }, { id: 91719 }];
        const chefEquipeCollection: IChefEquipe[] = [{ id: 123 }];
        expectedResult = service.addChefEquipeToCollectionIfMissing(chefEquipeCollection, ...chefEquipeArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const chefEquipe: IChefEquipe = { id: 123 };
        const chefEquipe2: IChefEquipe = { id: 456 };
        expectedResult = service.addChefEquipeToCollectionIfMissing([], chefEquipe, chefEquipe2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(chefEquipe);
        expect(expectedResult).toContain(chefEquipe2);
      });

      it('should accept null and undefined values', () => {
        const chefEquipe: IChefEquipe = { id: 123 };
        expectedResult = service.addChefEquipeToCollectionIfMissing([], null, chefEquipe, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(chefEquipe);
      });

      it('should return initial array if no ChefEquipe is added', () => {
        const chefEquipeCollection: IChefEquipe[] = [{ id: 123 }];
        expectedResult = service.addChefEquipeToCollectionIfMissing(chefEquipeCollection, undefined, null);
        expect(expectedResult).toEqual(chefEquipeCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
