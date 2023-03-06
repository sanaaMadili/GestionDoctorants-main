import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IDoctorant, Doctorant } from '../doctorant.model';

import { DoctorantService } from './doctorant.service';

describe('Doctorant Service', () => {
  let service: DoctorantService;
  let httpMock: HttpTestingController;
  let elemDefault: IDoctorant;
  let expectedResult: IDoctorant | IDoctorant[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(DoctorantService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      cne: 'AAAAAAA',
      etatProfessionnel: 0,
      photoCNEPileContentType: 'image/png',
      photoCNEPile: 'AAAAAAA',
      photoCNEFaceContentType: 'image/png',
      photoCNEFace: 'AAAAAAA',
      photoCvContentType: 'image/png',
      photoCv: 'AAAAAAA',
      anneeInscription: 0,
      etatDossier: 0,
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

    it('should create a Doctorant', () => {
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

      service.create(new Doctorant()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Doctorant', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          cne: 'BBBBBB',
          etatProfessionnel: 1,
          photoCNEPile: 'BBBBBB',
          photoCNEFace: 'BBBBBB',
          photoCv: 'BBBBBB',
          anneeInscription: 1,
          etatDossier: 1,
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

    it('should partial update a Doctorant', () => {
      const patchObject = Object.assign(
        {
          etatProfessionnel: 1,
          photoCv: 'BBBBBB',
          etatDossier: 1,
          lieuNaissance: 'BBBBBB',
          numeroTelephone: 1,
          genre: 'BBBBBB',
          nomArabe: 'BBBBBB',
          prnomArabe: 'BBBBBB',
        },
        new Doctorant()
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

    it('should return a list of Doctorant', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          cne: 'BBBBBB',
          etatProfessionnel: 1,
          photoCNEPile: 'BBBBBB',
          photoCNEFace: 'BBBBBB',
          photoCv: 'BBBBBB',
          anneeInscription: 1,
          etatDossier: 1,
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

    it('should delete a Doctorant', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addDoctorantToCollectionIfMissing', () => {
      it('should add a Doctorant to an empty array', () => {
        const doctorant: IDoctorant = { id: 123 };
        expectedResult = service.addDoctorantToCollectionIfMissing([], doctorant);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(doctorant);
      });

      it('should not add a Doctorant to an array that contains it', () => {
        const doctorant: IDoctorant = { id: 123 };
        const doctorantCollection: IDoctorant[] = [
          {
            ...doctorant,
          },
          { id: 456 },
        ];
        expectedResult = service.addDoctorantToCollectionIfMissing(doctorantCollection, doctorant);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Doctorant to an array that doesn't contain it", () => {
        const doctorant: IDoctorant = { id: 123 };
        const doctorantCollection: IDoctorant[] = [{ id: 456 }];
        expectedResult = service.addDoctorantToCollectionIfMissing(doctorantCollection, doctorant);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(doctorant);
      });

      it('should add only unique Doctorant to an array', () => {
        const doctorantArray: IDoctorant[] = [{ id: 123 }, { id: 456 }, { id: 9494 }];
        const doctorantCollection: IDoctorant[] = [{ id: 123 }];
        expectedResult = service.addDoctorantToCollectionIfMissing(doctorantCollection, ...doctorantArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const doctorant: IDoctorant = { id: 123 };
        const doctorant2: IDoctorant = { id: 456 };
        expectedResult = service.addDoctorantToCollectionIfMissing([], doctorant, doctorant2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(doctorant);
        expect(expectedResult).toContain(doctorant2);
      });

      it('should accept null and undefined values', () => {
        const doctorant: IDoctorant = { id: 123 };
        expectedResult = service.addDoctorantToCollectionIfMissing([], null, doctorant, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(doctorant);
      });

      it('should return initial array if no Doctorant is added', () => {
        const doctorantCollection: IDoctorant[] = [{ id: 123 }];
        expectedResult = service.addDoctorantToCollectionIfMissing(doctorantCollection, undefined, null);
        expect(expectedResult).toEqual(doctorantCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
