import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IPublication, Publication } from '../publication.model';

import { PublicationService } from './publication.service';

describe('Publication Service', () => {
  let service: PublicationService;
  let httpMock: HttpTestingController;
  let elemDefault: IPublication;
  let expectedResult: IPublication | IPublication[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PublicationService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      titre: 'AAAAAAA',
      date: 0,
      description: 'AAAAAAA',
      type: 'AAAAAAA',
      articleContentType: 'image/png',
      article: 'AAAAAAA',
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

    it('should create a Publication', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Publication()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Publication', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          titre: 'BBBBBB',
          date: 1,
          description: 'BBBBBB',
          type: 'BBBBBB',
          article: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Publication', () => {
      const patchObject = Object.assign(
        {
          titre: 'BBBBBB',
        },
        new Publication()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Publication', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          titre: 'BBBBBB',
          date: 1,
          description: 'BBBBBB',
          type: 'BBBBBB',
          article: 'BBBBBB',
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

    it('should delete a Publication', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addPublicationToCollectionIfMissing', () => {
      it('should add a Publication to an empty array', () => {
        const publication: IPublication = { id: 123 };
        expectedResult = service.addPublicationToCollectionIfMissing([], publication);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(publication);
      });

      it('should not add a Publication to an array that contains it', () => {
        const publication: IPublication = { id: 123 };
        const publicationCollection: IPublication[] = [
          {
            ...publication,
          },
          { id: 456 },
        ];
        expectedResult = service.addPublicationToCollectionIfMissing(publicationCollection, publication);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Publication to an array that doesn't contain it", () => {
        const publication: IPublication = { id: 123 };
        const publicationCollection: IPublication[] = [{ id: 456 }];
        expectedResult = service.addPublicationToCollectionIfMissing(publicationCollection, publication);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(publication);
      });

      it('should add only unique Publication to an array', () => {
        const publicationArray: IPublication[] = [{ id: 123 }, { id: 456 }, { id: 42080 }];
        const publicationCollection: IPublication[] = [{ id: 123 }];
        expectedResult = service.addPublicationToCollectionIfMissing(publicationCollection, ...publicationArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const publication: IPublication = { id: 123 };
        const publication2: IPublication = { id: 456 };
        expectedResult = service.addPublicationToCollectionIfMissing([], publication, publication2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(publication);
        expect(expectedResult).toContain(publication2);
      });

      it('should accept null and undefined values', () => {
        const publication: IPublication = { id: 123 };
        expectedResult = service.addPublicationToCollectionIfMissing([], null, publication, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(publication);
      });

      it('should return initial array if no Publication is added', () => {
        const publicationCollection: IPublication[] = [{ id: 123 }];
        expectedResult = service.addPublicationToCollectionIfMissing(publicationCollection, undefined, null);
        expect(expectedResult).toEqual(publicationCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
