import { HealthController } from './health.controller';

describe('HealthController', () => {
  it('returns the API health status', () => {
    const response = new HealthController().getHealth();

    expect(response.status).toBe('ok');
    expect(response.service).toBe('teeket-api');
    expect(response.timestamp).toBeTruthy();
  });
});
