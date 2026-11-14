import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineEchartComponent } from './line-echart.component';

describe('LineEchartComponent', () => {
  let component: LineEchartComponent;
  let fixture: ComponentFixture<LineEchartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LineEchartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LineEchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
