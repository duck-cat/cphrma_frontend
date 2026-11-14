import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FunnelChartComponent } from './funnel-chart.component';

describe('FunnelChartComponent', () => {
  let component: FunnelChartComponent;
  let fixture: ComponentFixture<FunnelChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FunnelChartComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(FunnelChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates a funnel chart with the supplied sample stages', () => {
    expect(component).toBeTruthy();
    expect(component.chartOption.series[0].type).toBe('funnel');
    expect(component.chartOption.series[0].data).toEqual([
      { value: 60, name: 'Visit' },
      { value: 40, name: 'Inquiry' },
      { value: 20, name: 'Order' },
      { value: 80, name: 'Click' },
      { value: 100, name: 'Show' }
    ]);
  });
});
