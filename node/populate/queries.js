module.exports = {
  create: {
    pageviews: `
      CREATE TABLE pageviews (
        id SERIAL PRIMARY KEY,
        time timestamp,
        product_id integer,
        visitor_id integer,
        browser_name varchar(32),
        url varchar(2048));`,
    atcClicks: `
      CREATE TABLE atc_clicks (
        id SERIAL PRIMARY KEY,
        impression_id integer REFERENCES pageviews(id),
        click_id integer,
        local_time timestamp);`
  },
  index: {
    impressionId: `
      CREATE INDEX impression_idx
        ON atc_clicks(impression_id);`,
    productId: `
      CREATE INDEX product_idx
        ON pageviews(product_id);`
  },
  copy: {
    pageviews: `
      COPY pageviews (time, product_id, visitor_id, browser_name, url)
        FROM STDIN;`,
    atcClicks: `
      COPY atc_clicks (impression_id, click_id, local_time)
        FROM STDIN;`
  }
}
