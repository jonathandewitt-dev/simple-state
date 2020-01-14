/**
 * Checks an old value against a new value. If it is an
 * object which has changed, or it has just become an object,
 * this will return true.
 */ 
export const getObjectChanged = (oldValue, newValue) => {

  const getObjectDiff = (oldObj, newObj) => {
    const oldIsObject = typeof oldObj === 'object'
    const newIsObject = typeof newObj === 'object'
    if (!newIsObject) return []
    const newKeys = Object.keys(newObj)
    return oldIsObject && newIsObject
      ? newKeys.filter(key => !(key in oldObj))
      : newKeys
  }
  
  const getDeepObjectDiff = (oldObj, newObj) => {
    const diff = getObjectDiff(oldObj, newObj)
    const deepDiff = [...diff]
    diff.forEach(key =>
      deepDiff.push(...getDeepObjectDiff(oldObj[key], newObj[key])))
    return deepDiff
  }

  return !!getDeepObjectDiff(oldValue, newValue).length
}