// db.js
import {Pool} from 'pg';

export const pool = new Pool({
  user: process.env.user,
  host: process.env.host,
  database: process.env.database,
  password: process.env.password,
  port: process.env.DB_port,
});

