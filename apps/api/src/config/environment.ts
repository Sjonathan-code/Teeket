interface Environment {
  API_PORT: number;
  API_PREFIX: string;
  DATABASE_URL: string;
  NODE_ENV: 'development' | 'test' | 'production';
}

const supportedNodeEnvironments = ['development', 'test', 'production'] as const;

export function validateEnvironment(config: Record<string, unknown>): Environment {
  const apiPort = Number(config.API_PORT ?? 3001);
  const apiPrefix = String(config.API_PREFIX ?? 'api');
  const databaseUrl = String(config.DATABASE_URL ?? '');
  const nodeEnvironment = String(config.NODE_ENV ?? 'development');

  if (!Number.isInteger(apiPort) || apiPort < 1 || apiPort > 65535) {
    throw new Error('API_PORT must be an integer between 1 and 65535.');
  }

  if (!/^[a-z0-9/-]+$/i.test(apiPrefix)) {
    throw new Error('API_PREFIX contains unsupported characters.');
  }

  if (!databaseUrl.startsWith('postgresql://')) {
    throw new Error('DATABASE_URL must be a PostgreSQL connection string.');
  }

  if (!supportedNodeEnvironments.includes(nodeEnvironment as Environment['NODE_ENV'])) {
    throw new Error('NODE_ENV must be development, test or production.');
  }

  return {
    API_PORT: apiPort,
    API_PREFIX: apiPrefix,
    DATABASE_URL: databaseUrl,
    NODE_ENV: nodeEnvironment as Environment['NODE_ENV'],
  };
}
