import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeasChartComponent } from './meas-chart.component';

describe('ChartComponent', () => {
  let component: MeasChartComponent;
  let fixture: ComponentFixture<MeasChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeasChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeasChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
