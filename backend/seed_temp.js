const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgres://postgres.soxgpfpjlaercfetfqpp:Pus32006181988@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres' });

pool.connect().then(async (client) => {
  try {
    await client.query('CREATE TABLE IF NOT EXISTS students (id SERIAL PRIMARY KEY, student_id VARCHAR(50) UNIQUE, citizen_id VARCHAR(50))');
    
    const mappings = [
      { stu: 'STU2026001', cit: 'CIT001' },
      { stu: 'STU2026002', cit: 'CIT002' },
      { stu: 'STU2026003', cit: 'CIT003' },
      { stu: 'STU2026004', cit: 'CIT004' },
      { stu: 'STU2026005', cit: 'CIT005' },
      { stu: 'STU2026006', cit: 'CIT006' }
    ];

    for (const m of mappings) {
      const res = await client.query('SELECT id FROM students WHERE student_id = $1', [m.stu]);
      if (res.rows.length === 0) {
        await client.query('INSERT INTO students (student_id, citizen_id) VALUES ($1, $2)', [m.stu, m.cit]);
      } else {
        await client.query('UPDATE students SET citizen_id = $2 WHERE student_id = $1', [m.cit, m.stu]);
      }
    }

    console.log('Seeded students table successfully.');
  } catch(e) {
    console.error(e);
  } finally {
    client.release();
    pool.end();
  }
});
