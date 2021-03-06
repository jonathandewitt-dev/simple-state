import { getObjectChanged, getStateSetError, isObject } from './utilities.js'

/** 
 * The syntax and behavior is basically the same as the native `Proxy`.
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy
 * This one, however, proxies all child objects infinitely deep.
*/
export class DeepProxy {
  constructor(
    target = {},
    handler = {},
    basePath = [],
  ) {

    Object.keys(target).forEach(key => {
      const path = [...basePath, key]

      // a small utility for managing nested proxies efficiently
      const ProxyUtility = {
        needsNewProxy: true,
        proxy: null,
        getProxy() {
          if (this.needsNewProxy) {
            this.needsNewProxy = false
            this.proxy = new DeepProxy(target[key], handler, path)
          }
          return this.proxy
        }
      }

      const get = () => {
        const defaultGetter = () => target[key]
        const getter = handler.get || defaultGetter
        return getter(target, key, path)
      }

      const set = newValue => {
        
        // check if this change requires setting
        // a new proxy for the getter.
        const oldValue = target[key]
        ProxyUtility.needsNewProxy = getObjectChanged(oldValue, newValue)

        const defaultSetter = () => target[key] = newValue
        const setter = handler.set || defaultSetter
        setter(target, key, newValue, path)
      }

      // only use the provided getter on non-objects.
      // This avoids problems with getters overriding the DeepProxy on child objects.
      const proxyGetter = () => {
        const valueIsObject = isObject(target[key])
        return valueIsObject ? ProxyUtility.getProxy() : get()
      }

      Object.defineProperty(this, key, { enumerable: true, get: proxyGetter, set })
    })
  }
}

export const createImmutableProxy = obj => new DeepProxy(
  obj,
  { set: () => {
    throw getStateSetError()
  }}
)

// the only purpose this serves is to get rid of the class import inside State.js,
// because Jest evidently hates classes. A lot.
export const createDeepProxy = (target, handler) => new DeepProxy(target, handler)
