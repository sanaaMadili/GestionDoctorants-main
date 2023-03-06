import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IFormationDoctoranle, FormationDoctoranle } from '../formation-doctoranle.model';

import { FormationDoctoranleService } from './formation-doctoranle.service';

describe('FormationDoctoranle Service', () => {
  let service: FormationDoctoranleService;
  let httpMock: HttpTestingController;
  let elemDefault: IFormationDoctoranle;
  let expectedResult: IFormationDoctoranle | IFormationDoctoranle[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(FormationDoctoranleService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      thematique: 'AAAAAAA',
      description: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a FormationDoctoranle', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new FormationDoctoranle()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a FormationDoctoranle', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          thematique: 'BBBBBB',
          description: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a FormationDoctoranle', () => {
      const patchObject = Object.assign(
        {
          thematique: 'BBBBBB',
          description: 'BBBBBB',
        },
        new FormationDoctoranle()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of FormationDoctoranle', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          thematique: 'BBBBBB',
          description: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a FormationDoctoranle', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addFormationDoctoranleToCollectionIfMissing', () => {
      it('should add a FormationDoctoranle to an empty array', () => {
        const formationDoctoranle: IFormationDoctoranle = { id: 123 };
        expectedResult = service.addFormationDoctoranleToCollectionIfMissing([], formationDoctoranle);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(formationDoctoranle);
      });

      it('should not add a FormationDoctoranle to an array that contains it', () => {
        const formationDoctoranle: IFormationDoctoranle = { id: 123 };
        const formationDoctoranleCollection: IFormationDoctoranle[] = [
          {
            ...formationDoctoranle,
          },
          { id: 456 },
        ];
        expectedResult = service.addFormationDoctoranleToCollectionIfMissing(formationDoctoranleCollection, formationDoctoranle);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a FormationDoctoranle to an array that doesn't contain it", () => {
        const formationDoctoranle: IFormationDoctoranle = { id: 123 };
        const formationDoctoranleCollection: IFormationDoctoranle[] = [{ id: 456 }];
        expectedResult = service.addFormationDoctoranleToCollectionIfMissing(formationDoctoranleCollection, formationDoctoranle);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(formationDoctoranle);
      });

      it('should add only unique FormationDoctoranle to an array', () => {
        const formationDoctoranleArray: IFormationDoctoranle[] = [{ id: 123 }, { id: 456 }, { id: 28320 }];
        const formationDoctoranleCollection: IFormationDoctoranle[] = [{ id: 123 }];
        expectedResult = service.addFormationDoctoranleToCollectionIfMissing(formationDoctoranleCollection, ...formationDoctoranleArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const formationDoctoranle: IFormationDoctoranle = { id: 123 };
        const formationDoctoranle2: IFormationDoctoranle = { id: 456 };
        expectedResult = service.addFormationDoctoranleToCollectionIfMissing([], formationDoctoranle, formationDoctoranle2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(formationDoctoranle);
        expect(expectedResult).toContain(formationDoctoranle2);
      });

      it('should accept null and undefined values', () => {
        const formationDoctoranle: IFormationDoctoranle = { id: 123 };
        expectedResult = service.addFormationDoctoranleToCollectionIfMissing([], null, formationDoctoranle, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(formationDoctoranle);
      });

      it('should return initial array if no FormationDoctoranle is added', () => {
        const formationDoctoranleCollection: IFormationDoctoranle[] = [{ id: 123 }];
        expectedResult = service.addFormationDoctoranleToCollectionIfMissing(formationDoctoranleCollection, undefined, null);
        expect(expectedResult).toEqual(formationDoctoranleCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
