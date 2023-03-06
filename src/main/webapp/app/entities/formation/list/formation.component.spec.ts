import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { FormationService } from '../service/formation.service';

import { FormationComponent } from './formation.component';

describe('Formation Management Component', () => {
  let comp: FormationComponent;
  let fixture: ComponentFixture<FormationComponent>;
  let service: FormationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [FormationComponent],
    })
      .overrideTemplate(FormationComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FormationComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(FormationService);

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
    expect(comp.formations?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
