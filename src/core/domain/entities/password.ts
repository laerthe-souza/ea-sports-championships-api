import { compareSync, hashSync } from 'bcrypt';

export class Password {
  private password: string;

  constructor(password: string) {
    this.password = password;
  }

  get getValue(): string {
    return this.password;
  }

  hash(): void {
    this.password = hashSync(this.password, 10);
  }

  compare(password: string): boolean {
    return compareSync(password, this.password);
  }

  validate(): void {
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(this.password)) {
      throw new Error(
        'Invalid password, must be a combination of upper and lower case characters and numbers',
      );
    }
  }
}
