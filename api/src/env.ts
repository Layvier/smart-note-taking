import * as typedEnv from '@freighthub/typed-env';
import * as dotenv from 'dotenv';

const OTHER = typedEnv.envGroup({
  NODE_ENV: typedEnv.types.NonEmptyString,
  PORT: typedEnv.types.PortNumber,
  OPENAI_API_KEY: typedEnv.types.NonEmptyString,
  ML_BASE_URL: typedEnv.types.NonEmptyString,
});

const envSchema = typedEnv.envSchema({
  OTHER,
});

dotenv.config();

type Env = typedEnv.TypeOf<typeof envSchema>;

export const env: Env = typedEnv.loadFromEnv(envSchema);
