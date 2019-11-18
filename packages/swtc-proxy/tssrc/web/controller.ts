import fs from "fs"
import path from "path"
import Router from "koa-router"

const apiRouter = Router()

// add url-route in /controllers:

function addMapping(router, mapping) {
  for (const url in mapping) {
    if (url.startsWith("GET ")) {
      const lpath = url.substring(4)
      router.get(lpath, mapping[url])
      console.log(`register URL mapping: GET ${lpath}`)
    } else if (url.startsWith("POST ")) {
      const lpath = url.substring(5)
      router.post(lpath, mapping[url])
      console.log(`register URL mapping: POST ${lpath}`)
    } else if (url.startsWith("PUT ")) {
      const lpath = url.substring(4)
      router.put(lpath, mapping[url])
      console.log(`register URL mapping: PUT ${lpath}`)
    } else if (url.startsWith("DELETE ")) {
      const lpath = url.substring(7)
      router.del(lpath, mapping[url])
      console.log(`register URL mapping: DELETE ${lpath}`)
    } else {
      console.log(`invalid URL: ${url}`)
    }
  }
}

function addControllers(router, dir) {
  fs.readdirSync(path.join(__dirname, dir))
    .filter(f => {
      return f.endsWith(".js")
    })
    .forEach(f => {
      console.log(`process controller: ${f}...`)
      const mapping = require(path.join(__dirname, dir, f))
      addMapping(router, mapping)
    })
}

export function controller(dir = "controllers") {
  addControllers(apiRouter, dir)
  return apiRouter.routes()
}
