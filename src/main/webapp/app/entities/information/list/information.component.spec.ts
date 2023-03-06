import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { InformationService } from '../service/information.service';

import { InformationComponent } from './information.component';

describe('Information Management Component', () => {
  let comp: InformationComponent;
  let fixture: ComponentFixture<InformationComponent>;
  let service: InformationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [InformationComponent],
    })
      .overrideTemplate(InformationComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(InformationComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(InformationService);

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
    expect(comp.information?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
