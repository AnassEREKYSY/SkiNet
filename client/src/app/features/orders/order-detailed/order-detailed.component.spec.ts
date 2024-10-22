import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDetailedComponent } from './order-detailed.component';

describe('OrderDetailedComponent', () => {
  let component: OrderDetailedComponent;
  let fixture: ComponentFixture<OrderDetailedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderDetailedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderDetailedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
