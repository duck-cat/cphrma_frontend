import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Stackedbarcharttype2Component } from './stackedbarcharttype-2.component';

describe('Stackedbarcharttype2Component', () => {
  let component: Stackedbarcharttype2Component;
  let fixture: ComponentFixture<Stackedbarcharttype2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Stackedbarcharttype2Component]
    }).compileComponents();

    fixture = TestBed.createComponent(Stackedbarcharttype2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates a normalized stacked chart using the supplied sample data', () => {
    expect(component).toBeTruthy();
    expect(component.chartOption.yAxis.max).toBe(1);
    expect(component.chartOption.series.filter((series: any) => series.type === 'bar').length).toBe(5);
    expect(component.chartOption.series.find((series: any) => series.name === 'Direct').data[0]).toBeCloseTo(100 / 1610);
  });
});
