import type { ConnectOptions, AnyAuth } from "surrealdb"
import { Surreal, ConnectionStatus } from "surrealdb"
 
/**
 * Maintains a single instance of surrealdb.
 * Automatically reconnects unless options.reconnect is set to false manually.
 */
export class MySurreal {
  // A single instantiation of a surreal connection
  private _surrealdb: Surreal | undefined
  private _url: string | URL
  private _opts: ConnectOptions | undefined
 
  constructor(
    url: Parameters<InstanceType<typeof Surreal>["connect"]>[0],
    opts?: ConnectOptions
  ) {
    this._url = url
    if (opts && opts.reconnect === undefined) {
      opts.reconnect = true
    }
    this._opts = opts
  }
 
  async surrealdb(): Promise<Surreal> {
    // Init Surreal
    if (!this._surrealdb) {
      this._surrealdb = new Surreal()
    }
 
    if (this._surrealdb.status == ConnectionStatus.Connected) {
      return this._surrealdb
    } else if (this._surrealdb.status == ConnectionStatus.Disconnected) {
      try {
        // Connect as a database user
        await this._surrealdb.connect(this._url, this._opts)
        if (process.env.NODE_ENV === "development") {
          const str = this.toConnectionString(
            this._surrealdb.status,
            this._opts
          )
          console.info(str)
        }
      } catch (error) {
        if (error instanceof Error) throw error
        throw new Error(error as unknown as string)
      }
    }
    return this._surrealdb
  }
 
  private toConnectionString(status: ConnectionStatus, opts?: ConnectOptions) {
    let str = `${status}`
    const auth = opts?.auth
 
    if (auth && typeof auth !== "string") {
      if ("username" in auth) {
        str += ` as ${auth.username}`
      }
      if ("database" in auth && "namespace" in auth) {
        str += ` for ${auth.namespace} ${auth.database}`
      } else if ("namespace" in auth) {
        str += ` for ${auth.namespace}`
      } else if ("database" in auth) {
        str += ` for ${auth.database}`
      }
    }
    return str
  }
}
 
/**
 * Converts environment variables to an AnyAuth type
 * to connect with the database
 * @param param0 - environment variables
 * @returns {RootAuth | NamespaceAuth | DatabaseAuth | ScopeAuth}
 */
export function toAnyAuth({
  username,
  password,
  namespace,
  database,
  scope,
}: Record<string, string | undefined>) {
  let auth: AnyAuth
  if (username && password && namespace && database) {
    auth = {
      database,
      namespace,
      username,
      password,
    }
  } else if (username && password && namespace) {
    auth = {
      namespace,
      username,
      password,
    }
  } else if (username && password) {
    auth = {
      username,
      password,
    }
  } else if (scope) {
    auth = {
      namespace,
      database,
      username,
      password,
      scope,
    }
  } else {
    throw new Error("unsupported any auth configuration")
  }
  return auth
}