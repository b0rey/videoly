const debug = require('debug')
const pgtools = require('pgtools')
const { Pool } = require('pg')
const copyFrom = require('pg-copy-streams').from

const { db } = require('../config')
const queries = require('./queries')
const RowReadable = require('./RowReadable')

function copyRows (client) {
  const log = debug('populate:copyRows')

  const { pageviews, atcClicks } = queries.copy
  const [streamPageviews, streamAtcClicks] = [pageviews, atcClicks]
    .map(query => client.query(copyFrom(query)))

  const [readPageview, readAtcClicks] = ['Pageviews', 'AtcClicks']
    .map(name => new RowReadable({ name }))

  return new Promise((resolve, reject) => {
    ;[streamPageviews, streamAtcClicks, readPageview, readAtcClicks]
      .map(obj => obj.on('error', reject))

    streamAtcClicks.on('end', () => {
      log('Stream AtcClicks finished')
      resolve()
    })

    streamPageviews.on('end', () => {
      log('Stream Pageviews finished')
      readAtcClicks.pipe(streamAtcClicks)
    })

    readPageview.pipe(streamPageviews)
  })
}

const dbCreate = async (name, config) => {
  const log = debug('populate:dbCreate')

  const creator = command => new Promise((resolve, reject) => {
    pgtools[command](config, name, (err, res) => {
      err ? reject(err) : resolve(res)
    })
  })

  await creator('dropdb').catch(() => log('Skip dropping'))

  return creator('createdb')
}

const table = (command, client) => {
  const log = debug(`populate:${command}`)

  return Promise.all(
    Object.keys(queries[command]).map(
      name => client
        .query(queries[command][name])
        .then(() => log(name))
    ))
}

const main = async () => {
  const log = debug('populate')

  await dbCreate(db.name, db)
  log(`DB ${db.name} created`)

  const pool = new Pool()
  const client = await pool.connect()
  log('Client connected')

  await table('create', client)

  await copyRows(client)
  log('Copy rows')

  await table('index', client)

  client.release()
  process.exit(0)
}

main()
