import { type Surreal } from "surrealdb"
import { MySurreal, toAnyAuth } from "$lib/surrealdb_utils";
 
export const clientPromise = new Promise<Surreal>(async (resolve, reject) => {
  try {
    const {
      AUTH_SURREAL_URL: auth_url,
      AUTH_SURREAL_NS: auth_ns,
      AUTH_SURREAL_DB: auth_db,
      AUTH_SURREAL_USER: auth_user,
      AUTH_SURREAL_PW: auth_pw,
      AUTH_SURREAL_SCOPE: auth_scope,
      SURREAL_NS: namespace,
      SURREAL_DB: database,
    } = process.env
    if (!auth_url) throw new Error("required auth_url")
    const auth = toAnyAuth({
      namespace: auth_ns,
      database: auth_db,
      username: auth_user,
      password: auth_pw,
      scope: auth_scope,
    })
    const surreal = new MySurreal(auth_url, {
      namespace,
      database,
      auth,
    })
    const db = await surreal.surrealdb()
    resolve(db)
  } catch (e) {
    reject(e)
  }
})