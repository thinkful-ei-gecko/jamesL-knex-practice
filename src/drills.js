require('dotenv').config();
const knex = require('knex');

//product_id, name, price, date_added, checked, category

const db = knex({
  client: 'pg',
  connection: process.env.DB_URL
})

function searchByName(searchTerm) {
  db
    .select('product_id', 'name', 'price', 'date_added', 'checked', 'category')
    .from('shopping_list')
    .where('name', 'ILIKE', `%${searchTerm}%`)
    .then(res => console.log(res))
}

function pagination(pageNumber) {
  const itemsPerPage = 6
  const offeset = itemsPerPage * (pageNumber - 1)
  db
    .select('product_id', 'name', 'price', 'date_added', 'checked', 'category')
    .from('shopping_list')
    .limit(itemsPerPage)
    .offset(offeset)
    .then(res => console.log(res))
}

function itemsDateAdded(daysAgo) {
  db
    .select('product_id', 'name', 'price', 'date_added', 'checked', 'category')
    .from('shopping_list')
    .where('date_added', '>', db.raw(`now() - '?? days'::INTERVAL`, daysAgo))
    .orderBy([{column: 'date_added', order: 'DESC'}])
    .then(res => console.log(res))
}

function totalCostPerCategory() {
  db
    .select('category')
    .sum('price AS total_cost')
    .from('shopping_list')
    .groupBy('category')
    .then(res => console.log(res))
}

