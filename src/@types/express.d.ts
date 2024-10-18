/* eslint-disable @typescript-eslint/naming-convention */

declare namespace Express {
  interface Request {
    user: {
      id: string;
      name: string;
      username: string;
    };
  }
}
