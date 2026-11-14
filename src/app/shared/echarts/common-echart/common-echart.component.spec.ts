import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonEchartComponent } from './common-echart.component';

describe('CommonEchartComponent', () => {
  let component: CommonEchartComponent;
  let fixture: ComponentFixture<CommonEchartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonEchartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CommonEchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
