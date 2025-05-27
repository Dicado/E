const db = require('../config/db');

exports.findCompanyByName = async (name) => {
    const query = 'SELECT * FROM companies WHERE name = ?';
    const [rows] = await db.execute(query, [name]);
    return rows[0];
};

exports.createCompany = async (name, companyId) => {
    const query = 'INSERT INTO companies (name, company_id) VALUES (?, ?)';
    const [result] = await db.execute(query, [name, companyId]);
    return result;
};