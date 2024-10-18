/* eslint-disable @typescript-eslint/naming-convention */

declare namespace Express {
  interface Request {
    player: {
      id: string;
      name: string;
      username: string;
    };
  }
}
