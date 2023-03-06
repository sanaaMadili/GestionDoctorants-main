import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ChercheurExterneService } from '../service/chercheur-externe.service';

import { ChercheurExterneComponent } from './chercheur-externe.component';

describe('ChercheurExterne Management Component', () => {
  let comp: ChercheurExterneComponent;
  let fixture: ComponentFixture<ChercheurExterneComponent>;
  let service: ChercheurExterneService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ChercheurExterneComponent],
    })
      .overrideTemplate(ChercheurExterneComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ChercheurExterneComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ChercheurExterneService);

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
    expect(comp.chercheurExternes?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
