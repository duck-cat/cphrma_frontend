import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SliderPageComponent } from './slider-page.component';

describe('SliderPageComponent', () => {
  let component: SliderPageComponent;
  let fixture: ComponentFixture<SliderPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SliderPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SliderPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
