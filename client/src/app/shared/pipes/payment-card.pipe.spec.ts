import { PaymentPipe } from './payment-card.pipe';

describe('PaymentPipe', () => {
  it('create an instance', () => {
    const pipe = new PaymentPipe();
    expect(pipe).toBeTruthy();
  });
});
