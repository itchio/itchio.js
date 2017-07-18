import { AuthenticatedClient, IGetClientOpts } from "./types";

import { IUserResponse } from "./types";
import { camelifyObject } from "./camelify";
import request from "./request";

export default class AppClient extends AuthenticatedClient {
  constructor(private apiKey: string, private opts: IGetClientOpts) {
    super();
  }

  async getCurrentUser(): Promise<IUserResponse> {
    return await this.get("/me");
  }

  async get(path: string): Promise<any> {
    const res = await request({
      method: "get",
      url: this.opts.rootUrl + "/api/1/jwt" + path,
      headers: {
        Authorization: this.apiKey,
        Accept: "application/json",
      },
    });

    try {
      const response = JSON.parse(res.responseText);
      if (response.errors) {
        throw new Error(`itch.io API error: ${response.errors.join(", ")}`);
      } else {
        return camelifyObject(response);
      }
    } catch (e) {
      throw new Error(`itch.io API data format error: ${e.message}`);
    }
  }
}
