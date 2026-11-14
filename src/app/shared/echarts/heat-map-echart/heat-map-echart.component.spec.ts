import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeatMapEchartComponent } from './heat-map-echart.component';

describe('HeatMapEchartComponent', () => {
  let component: HeatMapEchartComponent;
  let fixture: ComponentFixture<HeatMapEchartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeatMapEchartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HeatMapEchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
