import "dotenv/config";
import { Client } from "pg";

(async () => {
  const targetDb = (process.env.DB_NAME || 'student_db').trim();
  const safeDb = targetDb.replace(/[^a-zA-Z0-9_]/g, '');

  const adminConfig = {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'postgres',
  };

  const client = new Client(adminConfig);
  await client.connect();

  const check = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [targetDb]);
  if (check.rowCount === 0) {
    await client.query(`CREATE DATABASE ${safeDb}`);
    console.log('created-db:' + safeDb);
  } else {
    console.log('db-exists:' + targetDb);
  }

  await client.end();
})().catch((e) => {
  console.error('db-create-failed:' + e.message);
  process.exit(1);
});
