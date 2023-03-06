import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISujet, Sujet } from '../sujet.model';

import { SujetService } from './sujet.service';

describe('Sujet Service', () => {
  let service: SujetService;
  let httpMock: HttpTestingController;
  let elemDefault: ISujet;
  let expectedResult: ISujet | ISujet[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SujetService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      titre: 'AAAAAAA',
      description: 'AAAAAAA',
      domaines: 'AAAAAAA',
      motsCles: 'AAAAAAA',
      context: 'AAAAAAA',
      profilRecherchees: 'AAAAAAA',
      annee: 0,
      reference: 'AAAAAAA',
      candidatures: 'AAAAAAA',
      coencadrent: 'AAAAAAA',
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

    it('should create a Sujet', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Sujet()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Sujet', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          titre: 'BBBBBB',
          description: 'BBBBBB',
          domaines: 'BBBBBB',
          motsCles: 'BBBBBB',
          context: 'BBBBBB',
          profilRecherchees: 'BBBBBB',
          annee: 1,
          reference: 'BBBBBB',
          candidatures: 'BBBBBB',
          coencadrent: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Sujet', () => {
      const patchObject = Object.assign(
        {
          description: 'BBBBBB',
          domaines: 'BBBBBB',
          context: 'BBBBBB',
          annee: 1,
          coencadrent: 'BBBBBB',
        },
        new Sujet()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Sujet', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          titre: 'BBBBBB',
          description: 'BBBBBB',
          domaines: 'BBBBBB',
          motsCles: 'BBBBBB',
          context: 'BBBBBB',
          profilRecherchees: 'BBBBBB',
          annee: 1,
          reference: 'BBBBBB',
          candidatures: 'BBBBBB',
          coencadrent: 'BBBBBB',
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

    it('should delete a Sujet', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addSujetToCollectionIfMissing', () => {
      it('should add a Sujet to an empty array', () => {
        const sujet: ISujet = { id: 123 };
        expectedResult = service.addSujetToCollectionIfMissing([], sujet);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(sujet);
      });

      it('should not add a Sujet to an array that contains it', () => {
        const sujet: ISujet = { id: 123 };
        const sujetCollection: ISujet[] = [
          {
            ...sujet,
          },
          { id: 456 },
        ];
        expectedResult = service.addSujetToCollectionIfMissing(sujetCollection, sujet);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Sujet to an array that doesn't contain it", () => {
        const sujet: ISujet = { id: 123 };
        const sujetCollection: ISujet[] = [{ id: 456 }];
        expectedResult = service.addSujetToCollectionIfMissing(sujetCollection, sujet);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(sujet);
      });

      it('should add only unique Sujet to an array', () => {
        const sujetArray: ISujet[] = [{ id: 123 }, { id: 456 }, { id: 94315 }];
        const sujetCollection: ISujet[] = [{ id: 123 }];
        expectedResult = service.addSujetToCollectionIfMissing(sujetCollection, ...sujetArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const sujet: ISujet = { id: 123 };
        const sujet2: ISujet = { id: 456 };
        expectedResult = service.addSujetToCollectionIfMissing([], sujet, sujet2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(sujet);
        expect(expectedResult).toContain(sujet2);
      });

      it('should accept null and undefined values', () => {
        const sujet: ISujet = { id: 123 };
        expectedResult = service.addSujetToCollectionIfMissing([], null, sujet, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(sujet);
      });

      it('should return initial array if no Sujet is added', () => {
        const sujetCollection: ISujet[] = [{ id: 123 }];
        expectedResult = service.addSujetToCollectionIfMissing(sujetCollection, undefined, null);
        expect(expectedResult).toEqual(sujetCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
