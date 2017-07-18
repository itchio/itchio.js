export interface IItchBlock {
  /**
   * Environment variables
   */
  env: {
    [key: string]: string;
  };
}

export type InAppWindow = typeof window & {
  Itch: IItchBlock;
};

export interface IUser {
  id: number;
  username: string;
  displayName: string;
}

export interface IUserResponse {
  user: IUser;
}

export abstract class AuthenticatedClient {
  abstract getCurrentUser(): Promise<IUserResponse>;
}

export interface IGetClientOpts {
  rootUrl: string;
  scope: string;
}

export interface IGetGameDataOpts {
  // the `foo` in `https://foo.itch.io/bar`
  user: string;

  // the `bar` in `https://foo.itch.io/bar`
  game: string;

  rootUrl?: string;
}

export interface IAttachBuyButtonOpts extends IGetGameDataOpts {
  width?: number;
  height?: number;
}

export interface IGameDataResponse {
  /** unique identifier of the game on itch.io */
  id: number;

  /** price of the game as a human-readable string */
  price: string;

  /** human-readable title of the game */
  title: string;

  /** info about the best currently active sale, if any */
  sale?: {
    /** unique identifier of the sale on itch.io */
    id: number;

    /** date the sale will end at */
    endDate: Date;

    /** title of the sale */
    title: string;

    /** discount on the game, in percent */
    rate: number;
  };
}
