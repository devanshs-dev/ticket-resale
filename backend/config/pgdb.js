const { Pool } = require('pg')

const pool = new Pool({
  user: 'devanshsingh',
  host: 'localhost',
  database: 'ticketresale',
  password: '',
  port: 5432,
})

pool.connect()
  .then(() => console.log('PostgreSQL connected'))
  .catch((err) => console.error('PostgreSQL connection error:', err))

module.exports = pool