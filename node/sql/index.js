const debug = require('debug')
const { Client } = require('pg')

const queries = require('./queries')

const main = async () => {
  const log = debug('sql')
  const client = new Client()
  await client.connect()

  await Promise.all(Object.keys(queries).map(async name => {
    const res = await client.query(queries[name])
    log(name, res.rows[0])
  }))

  await client.end()
  process.exit(0)
}

main()
