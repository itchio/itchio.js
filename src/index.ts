import { InAppWindow, IGetClientOpts } from "./types";

import {
  IGameDataResponse,
  IGetGameDataOpts,
  IAttachBuyButtonOpts,
} from "./types";

import Client from "./client";
import request from "./request";
import { camelifyObject } from "./camelify";

const inAppWindow = window as InAppWindow;
declare var process: any;

const defaultRootUrl = "https://itch.io";
const defaultScope = "profile:me";

class API {
  async getClient(userOpts: Partial<IGetClientOpts> = {}): Promise<Client> {
    const opts: IGetClientOpts = {
      rootUrl: userOpts.rootUrl || defaultRootUrl,
      scope: userOpts.scope || defaultScope,
    };

    // HTML5 game launched by itch app
    if (inAppWindow && inAppWindow.Itch) {
      const { Itch } = inAppWindow;
      if (Itch.env && Itch.env.ITCHIO_API_KEY) {
        return new Client(Itch.env.ITCHIO_API_KEY, opts);
      }

      throw new Error(
        `Missing API key - have you requested it in your app manifest? `,
      );
    }

    // Electron, node-webkit games launched by itch app
    if (typeof process !== "undefined") {
      if (process.env && process.env.ITCHIO_API_KEY) {
        return new Client(process.env.ITCHIO_API_KEY, opts);
      }
    }

    // HTML5 game embedded on itch.io site
    if (window && window.parent) {
      return new Promise<Client>((resolve, reject) => {
        window.addEventListener("message", ev => {
          const { hostname } = new URL(ev.origin);
          if (/^[^\.]\.itch\.io$/.test(hostname)) {
            // itch.io subdomain, that's ok
          } else if (/^[^\.]\.localhost\.com$/.test(hostname)) {
            // local itch.io subdomain, that's ok too
          } else {
            // reject everything else
            return;
          }

          if (ev.data.name == "api-key-response") {
            resolve(new Client(ev.data.key, opts));
          }
        });

        const { scope } = opts;
        window.parent.postMessage({ name: "api-key-request", scope }, "*");
      });
    }

    throw new Error(
      `Not launched by itch app and not embedded into itch.io, not sure what to do`,
    );
  }

  async getGameData(opts: IGetGameDataOpts): Promise<IGameDataResponse> {
    const { rootUrl = defaultRootUrl, user, game } = opts;

    const u = new URL(rootUrl);
    const dataUrl = `${u.protocol}//${user}.${u.host}/${game}/data.json`;

    const res = await request({
      method: "get",
      url: dataUrl,
    });

    return camelifyObject(JSON.parse(res.responseText));
  }

  attachBuyButton(el: HTMLElement, opts: Partial<IAttachBuyButtonOpts>) {
    const {
      rootUrl = defaultRootUrl,
      user,
      game,
      width = 680,
      height = 400,
    } = opts;

    if (!user) {
      throw new Error(`Missing user`);
    }
    if (!game) {
      throw new Error(`Missing game`);
    }

    const top = (screen.height - height) * 0.5;
    const left = (screen.width - width) * 0.5;

    const u = new URL(rootUrl);
    const purchaseUrl = `${u.protocol}//${user}.${u.host}/${game}/purchase?popup=1`;
    const features = `scrollbars=1, resizeable=no, width=${width}, height=${height}, top=${top}, left=${left}`;

    el.addEventListener("click", e => {
      e.preventDefault();

      const w = window.open(purchaseUrl, "purchase", features);
      if (w && w.focus) {
        w.focus();
      }
    });
  }
}

const api = new API();

export default api;
