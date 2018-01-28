const _ = require('lodash')
const { Readable } = require('stream')
const gen = require('./generators')
const limit = require('./limits')

const rowBuffers = { click1: [], clickN: [] }

const productId = gen.Id(limit.counters.product)
const visitorId = gen.Id(limit.counters.visitor)

module.exports = class RowReadable extends Readable {
  constructor (props) {
    super(props)
    this.rowFn = this[`row${props.name}`]
    this.rowCounter = 0
  }

  rowPageviews ({ timeRange, browsers, schemas, hosts, counters }) {
    const timestamp = gen.timerange(timeRange)
    const time = new Date(timestamp).toISOString()
    const browser = _.sample(gen.browsers)
    const url = gen.url({ schemas, hosts })

    if (Math.random() >= 0.5) {
      const click = { impressionId: this.rowCounter, timestamp }
      const pageClicks = _.times(_.random(0, 5), () => (click))
      rowBuffers.click1.push(click)
      rowBuffers.clickN.push(...pageClicks)
    }

    return [
      time, productId(), visitorId(), browser, url + '\n'
    ].join('\t')
  }

  rowAtcClicks ({ counters }) {
    const clickId = _.random(0, counters.rows)
    const { click1, clickN } = rowBuffers
    const { impressionId, timestamp } = click1.pop() || clickN.pop()
    const time = new Date(
      timestamp + _.random(1000, 300000)
    ).toISOString()

    return [impressionId, clickId, time + '\n'].join('\t')
  }

  _read () {
    ++this.rowCounter > limit.counters.rows
      ? this.push(null)
      : this.push(this.rowFn(limit))
  }
}
