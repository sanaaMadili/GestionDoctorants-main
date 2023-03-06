import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { SujetService } from '../service/sujet.service';

import { SujetComponent } from './sujet.component';

describe('Sujet Management Component', () => {
  let comp: SujetComponent;
  let fixture: ComponentFixture<SujetComponent>;
  let service: SujetService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [SujetComponent],
    })
      .overrideTemplate(SujetComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SujetComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(SujetService);

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
    expect(comp.sujets?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
