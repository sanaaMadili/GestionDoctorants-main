import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ChefLabService } from '../service/chef-lab.service';

import { ChefLabComponent } from './chef-lab.component';

describe('ChefLab Management Component', () => {
  let comp: ChefLabComponent;
  let fixture: ComponentFixture<ChefLabComponent>;
  let service: ChefLabService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ChefLabComponent],
    })
      .overrideTemplate(ChefLabComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ChefLabComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ChefLabService);

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
    expect(comp.chefLabs?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
