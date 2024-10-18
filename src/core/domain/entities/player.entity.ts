import { randomUUID } from 'crypto';

import { Password } from './password';

type IPlayerDTO = {
  id: string;
  name: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
};

type IRestorePlayerInput = {
  id: string;
  name: string;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};

type ICreatePlayerInput = {
  name: string;
  username: string;
  password: string;
  confirmPassword: string;
};

type IConstructorInput = {
  id: string;
  name: string;
  username: string;
  password: Password;
  createdAt: Date;
  updatedAt: Date;
};

export class Player {
  protected id: string;
  protected name: string;
  protected username: string;
  protected password: Password;
  protected createdAt: Date;
  protected updatedAt: Date;

  protected constructor(player: IConstructorInput) {
    this.id = player.id;
    this.name = player.name;
    this.username = player.username;
    this.password = player.password;
    this.createdAt = player.createdAt;
    this.updatedAt = player.updatedAt;
  }

  get getData(): IPlayerDTO {
    const { id, name, username, createdAt, updatedAt } = this;

    return { id, name, username, createdAt, updatedAt };
  }

  get getPassword(): Password {
    return this.password;
  }

  static create(player: ICreatePlayerInput): Player {
    if (player.password !== player.confirmPassword) {
      throw new Error('Passwords not match');
    }

    const password = new Password(player.password);

    password.validate();
    password.hash();

    return new Player({
      id: randomUUID(),
      name: player.name,
      username: player.username,
      password,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static restore(player: IRestorePlayerInput): Player {
    return new Player({ ...player, password: new Password(player.password) });
  }
}
