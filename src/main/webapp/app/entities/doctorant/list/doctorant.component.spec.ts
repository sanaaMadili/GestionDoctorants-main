import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { DoctorantService } from '../service/doctorant.service';

import { DoctorantComponent } from './doctorant.component';

describe('Doctorant Management Component', () => {
  let comp: DoctorantComponent;
  let fixture: ComponentFixture<DoctorantComponent>;
  let service: DoctorantService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [DoctorantComponent],
    })
      .overrideTemplate(DoctorantComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DoctorantComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(DoctorantService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.doctorants?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
