const factor = 1000

module.exports = {
  schemas: ['http', 'https'],
  browsers: ['firefox', 'chrome', 'safari', 'edge', 'ie'],
  timeRange: {
    from: +new Date('2017-1-1'),
    to: +new Date('2017-8-31')
  },
  counters: {
    rows: 1000 * factor,
    visitor: 700 * factor,
    product: 200 * factor
  },
  hosts: [
    'localhost',
    '127.0.0.2',
    'google.com',
    'shop1.com',
    'shop2.com',
    'www.shop1.com',
    'www.google.com',
    'shop4.ru',
    'www3.shop4.ru'
  ]
}
