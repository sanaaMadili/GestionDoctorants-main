import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { FormationDoctorantService } from '../service/formation-doctorant.service';

import { FormationDoctorantComponent } from './formation-doctorant.component';

describe('FormationDoctorant Management Component', () => {
  let comp: FormationDoctorantComponent;
  let fixture: ComponentFixture<FormationDoctorantComponent>;
  let service: FormationDoctorantService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [FormationDoctorantComponent],
    })
      .overrideTemplate(FormationDoctorantComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FormationDoctorantComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(FormationDoctorantService);

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
    expect(comp.formationDoctorants?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
