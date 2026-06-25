// db.js
import { Pool } from 'pg';

//For Supabase Database
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

//For Localhost
// export const pool = new Pool({
//   user: process.env.user,
//   host: process.env.host,
//   database: process.env.database,
//   password: process.env.password,
//   port: process.env.DB_port,
// });