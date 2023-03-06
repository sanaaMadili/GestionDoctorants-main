import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IReinscription, Reinscription } from '../reinscription.model';

import { ReinscriptionService } from './reinscription.service';

describe('Reinscription Service', () => {
  let service: ReinscriptionService;
  let httpMock: HttpTestingController;
  let elemDefault: IReinscription;
  let expectedResult: IReinscription | IReinscription[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ReinscriptionService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      formulaireReinscriptionContentType: 'image/png',
      formulaireReinscription: 'AAAAAAA',
      demandeContentType: 'image/png',
      demande: 'AAAAAAA',
      annee: 0,
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

    it('should create a Reinscription', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Reinscription()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Reinscription', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          formulaireReinscription: 'BBBBBB',
          demande: 'BBBBBB',
          annee: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Reinscription', () => {
      const patchObject = Object.assign(
        {
          formulaireReinscription: 'BBBBBB',
          demande: 'BBBBBB',
          annee: 1,
        },
        new Reinscription()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Reinscription', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          formulaireReinscription: 'BBBBBB',
          demande: 'BBBBBB',
          annee: 1,
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

    it('should delete a Reinscription', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addReinscriptionToCollectionIfMissing', () => {
      it('should add a Reinscription to an empty array', () => {
        const reinscription: IReinscription = { id: 123 };
        expectedResult = service.addReinscriptionToCollectionIfMissing([], reinscription);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(reinscription);
      });

      it('should not add a Reinscription to an array that contains it', () => {
        const reinscription: IReinscription = { id: 123 };
        const reinscriptionCollection: IReinscription[] = [
          {
            ...reinscription,
          },
          { id: 456 },
        ];
        expectedResult = service.addReinscriptionToCollectionIfMissing(reinscriptionCollection, reinscription);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Reinscription to an array that doesn't contain it", () => {
        const reinscription: IReinscription = { id: 123 };
        const reinscriptionCollection: IReinscription[] = [{ id: 456 }];
        expectedResult = service.addReinscriptionToCollectionIfMissing(reinscriptionCollection, reinscription);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(reinscription);
      });

      it('should add only unique Reinscription to an array', () => {
        const reinscriptionArray: IReinscription[] = [{ id: 123 }, { id: 456 }, { id: 32898 }];
        const reinscriptionCollection: IReinscription[] = [{ id: 123 }];
        expectedResult = service.addReinscriptionToCollectionIfMissing(reinscriptionCollection, ...reinscriptionArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const reinscription: IReinscription = { id: 123 };
        const reinscription2: IReinscription = { id: 456 };
        expectedResult = service.addReinscriptionToCollectionIfMissing([], reinscription, reinscription2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(reinscription);
        expect(expectedResult).toContain(reinscription2);
      });

      it('should accept null and undefined values', () => {
        const reinscription: IReinscription = { id: 123 };
        expectedResult = service.addReinscriptionToCollectionIfMissing([], null, reinscription, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(reinscription);
      });

      it('should return initial array if no Reinscription is added', () => {
        const reinscriptionCollection: IReinscription[] = [{ id: 123 }];
        expectedResult = service.addReinscriptionToCollectionIfMissing(reinscriptionCollection, undefined, null);
        expect(expectedResult).toEqual(reinscriptionCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
