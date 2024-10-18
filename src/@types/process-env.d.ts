/* eslint-disable @typescript-eslint/naming-convention */

import { IMyAppEnvVariables } from '@core/infra/environment-config.validation';

declare global {
  namespace NodeJS {
    interface ProcessEnv extends IMyAppEnvVariables {}
  }
}
