import connection from "@/lib/db";

const queryStudent = (sql) => new Promise(async (resolve, reject) => {
  connection.query(sql, (err, results) => {
    if (err) {
      reject(err.message);
    }
    else resolve(results);
  }
  )
})

export async function POST(request) {
  const { sql } = await request.json();
  const res = await queryStudent(sql);
  return Response.json(res)
}