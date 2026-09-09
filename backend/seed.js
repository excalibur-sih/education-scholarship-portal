const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgres://postgres.soxgpfpjlaercfetfqpp:Pus32006181988@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres' });
pool.connect().then(async (client) => {
  await client.query('CREATE TABLE IF NOT EXISTS students (id SERIAL PRIMARY KEY, student_id VARCHAR(50) UNIQUE, citizen_id VARCHAR(50))');
  await client.query(INSERT INTO students (student_id, citizen_id) VALUES ('STU2026001', 'CIT001') ON CONFLICT (student_id) DO UPDATE SET citizen_id = 'CIT001');
  await client.query(INSERT INTO students (student_id, citizen_id) VALUES ('STU2026002', 'CIT002') ON CONFLICT (student_id) DO UPDATE SET citizen_id = 'CIT002');
  console.log('Seeded students table');
  client.release();
  pool.end();
}).catch(e => console.error(e));
