const _ = require('lodash')
const URI = require('urijs')

const str = (length = _.random(1, 5)) => {
  let result = ''

  while (result.length < length) {
    result += Math.random().toString(36).slice(2)
  }

  return result.substr(0, length)
}

const path = () => _.times(
  _.random(3),
  () => `/${str()}`
).join('')

const query = () => _.times(
  _.random(3),
  () => `${str()}=${str()}`
).join('&')

const url = ({ schemas, hosts }) => {
  return new URI({
    protocol: _.sample(schemas),
    hostname: _.sample(hosts),
    path: path(),
    query: query()
  }).toString()
}

const Id = (max) => {
  const set = new Set()
  let arr
  return () => {
    if (set.size < max) {
      const id = _.random(1, 999999999)
      set.add(id)
      return id
    }

    if (!arr) {
      arr = [...set]
    }

    return arr[_.random(0, arr.length - 1)]
  }
}

const timerange = ({ from, to }) => _.random(from, to)

module.exports = {
  url,
  timerange,
  Id
}
