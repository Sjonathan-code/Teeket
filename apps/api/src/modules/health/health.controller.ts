import { Controller, Get } from '@nestjs/common';
import { Public } from '../../security/decorators/public.decorator';

interface HealthResponse {
  status: 'ok';
  service: 'teeket-api';
  timestamp: string;
}

@Controller('health')
export class HealthController {
  @Get()
  @Public()
  getHealth(): HealthResponse {
    return {
      status: 'ok',
      service: 'teeket-api',
      timestamp: new Date().toISOString(),
    };
  }
}
