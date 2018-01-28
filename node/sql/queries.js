module.exports = {
  rowPageviews: `SELECT COUNT (*) FROM pageviews;`,
  rowActClicks: `SELECT COUNT (*) FROM atc_clicks;`,
  uniqueImpression: `
    SELECT COUNT(DISTINCT impression_id)
    FROM atc_clicks;`,
  uniqueVisitor: `
    SELECT COUNT(DISTINCT visitor_id)
    FROM pageviews;`,
  uniqueProduct: `
    SELECT COUNT(DISTINCT product_id)
    FROM pageviews;`,
  pageviewsNotRelated: `
    SELECT COUNT(id)
    FROM pageviews
    WHERE NOT EXISTS (
      SELECT impression_id
      FROM atc_clicks
      WHERE impression_id = pageviews.id
    );`,
  minClicksForOneImpression: `
    SELECT MIN(count_clicks)
    FROM (
      SELECT COUNT(impression_id) AS count_clicks
      FROM atc_clicks GROUP BY impression_id
    ) t;`,
  maxClicksForOneImpression: `
    SELECT MAX(count_clicks)
    FROM (
      SELECT COUNT(impression_id) AS count_clicks
      FROM atc_clicks GROUP BY impression_id
    ) t;`,
  uniqueProductsVisitedInJune: `
    SELECT COUNT(DISTINCT product)
    FROM (
      SELECT EXTRACT(MONTH FROM time) as month, product_id as product
      FROM pageviews
    ) t
    WHERE month = 6;`,
  validHostnames: `
    SELECT COUNT(url)
    FROM pageviews
    WHERE url ~ '(localhost|127.0.0.2|google.com|shop1.com|shop2.com|www.shop1.com|www.google.com|shop4.ru|www3.shop4.ru)';`,
  minDatePageviews: `
    SELECT MIN(time)
    FROM pageviews;`,
  maxDatePageviews: `
    SELECT MAX(time)
    FROM pageviews;`,
  minClickShift: `
    SELECT MIN(local_time - time)
    FROM atc_clicks, pageviews
    WHERE pageviews.id = impression_id`,
  maxClickShift: `
    SELECT MAX(local_time - time)
    FROM atc_clicks, pageviews
    WHERE pageviews.id = impression_id`
}
