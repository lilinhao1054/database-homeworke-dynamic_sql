export const pageQueryStudent = (sql) =>
  fetch('/api/students', { method: 'POST', body: JSON.stringify({ sql }) })
    .then(res => res.json());