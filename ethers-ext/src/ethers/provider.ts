import _ from "lodash";
import { JsonRpcProvider as EthersJsonRpcProvider } from "@ethersproject/providers";
import { ConnectionInfo } from "@ethersproject/web";
import { Networkish } from "@ethersproject/networks";

// @ts-ignore: package @klaytn/web3rpc has no .d.ts file.
import { ApiClient, AdminApi, DebugApi, GovernanceApi, KlayApi, NetApi, PersonalApi, TxpoolApi } from "@klaytn/web3rpc";

// NamespaceApi classes generated by openapi-generator-javascript.
interface OpenApi {
  new (apiClient: any): OpenApi;
}

export class JsonRpcProvider extends EthersJsonRpcProvider {

  openApiClient: any;

  constructor(url?: ConnectionInfo | string, network?: Networkish) {
    super(url, network);

    this.openApiClient = makeApiClient(url);
  }

  get admin(): AsyncOpenApi      { return this.getAsyncOpenApi(AdminApi); }
  get debug(): AsyncOpenApi      { return this.getAsyncOpenApi(DebugApi); }
  get governance(): AsyncOpenApi { return this.getAsyncOpenApi(GovernanceApi); }
  get klay(): AsyncOpenApi       { return this.getAsyncOpenApi(KlayApi); }
  get net(): AsyncOpenApi        { return this.getAsyncOpenApi(NetApi); }
  get personal(): AsyncOpenApi   { return this.getAsyncOpenApi(PersonalApi); }
  get txpol(): AsyncOpenApi      { return this.getAsyncOpenApi(TxpoolApi); }

  getAsyncOpenApi(OpenApi: OpenApi): AsyncOpenApi {
    return new AsyncOpenApi(new OpenApi(this.openApiClient));
  }
}

// Make OpenAPI-Generator ApiClient from ConnectionInfo
function makeApiClient(url?: ConnectionInfo | string): any {
  if (_.isString(url)) {
    return new ApiClient(url);
  }

  // Transplant ethers ConnectionInfo settings to OpenAPI ApiClient settings.
  // Some ConnectionInfo settings are sliently ignored.
  // See https://github.com/ethers-io/ethers.js/blob/v5/packages/web/src.ts/index.ts#L97:_fetchData
  // See https://github.com/klaytn/web3klaytn/blob/dev/web3rpc/sdk/client/javascript/template/libraries/javascript/ApiClient.mustache
  let conn = url as ConnectionInfo;
  let client = new ApiClient(conn.url);

  if (conn.user && conn.password) {
    client.authentications = {
      "basic": {
        username: conn.user,
        password: conn.password,
      }
    };
  }
  if (_.isNumber(conn.timeout)) {
    // Both timeouts are in milliseconds.
    client.timeout = conn.timeout;
  }
  if (conn.headers) {
    _.forOwn(conn.headers, (value, key) => {
      client.defaultHeaders[key] = value;
    });
  }

  return client;
}

// A wrapper to OpenApi class where all its methods are promisified.
class AsyncOpenApi {
  openApi: any;
  [key: string | symbol]: Function; // dynamically generated methods

  constructor(openApi: any) {
    this.openApi = openApi;
    this._promisifyApi();
  }

  _promisifyApi() {
    let proto = Reflect.getPrototypeOf(this.openApi);
    if (proto) {
      let methods = Reflect.ownKeys(proto);
      // Promisify each methods
      _.forEach(methods, (method) => {
        // Assume that the prototype only has a constructor and API methods.
        if (method == 'constructor') {
          return;
        }
        this[method] = async (...args: any[]): Promise<any> => {
          return this._asyncCall(method, ...args)
        };
      });
    }
  }

  async _asyncCall(name: string | symbol, ...args: any[]) {
    let opts = {};
    return new Promise((resolve, reject) => {
      this.openApi[name](...args, opts, (err: any, data: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }
}
