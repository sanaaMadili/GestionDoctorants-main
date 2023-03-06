import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { BourseService } from '../service/bourse.service';

import { BourseComponent } from './bourse.component';

describe('Bourse Management Component', () => {
  let comp: BourseComponent;
  let fixture: ComponentFixture<BourseComponent>;
  let service: BourseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [BourseComponent],
    })
      .overrideTemplate(BourseComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BourseComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(BourseService);

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
    expect(comp.bourses?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
