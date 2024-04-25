const { query } = require('./db');
const { v4: uuidv4 } = require('uuid');

class SparepartType {
    // Method untuk menambah tipe suku cadang ke database
    static async create(type) {
        const { name } = type;
        const uuid = uuidv4();
        const sql = `
            INSERT INTO sparepart_type (uuid, name)
            VALUES (?, ?)
        `;
        const result = await query(sql, [uuid, name]);
        return result.insertId;
    }

    // Method untuk memperbarui tipe suku cadang berdasarkan UUID
    static async update(uuid, updates) {
        const { name } = updates;
        const sql = `
            UPDATE sparepart_type
            SET name = ?
            WHERE uuid = ?
        `;
        const result = await query(sql, [name, uuid]);
        return result.affectedRows > 0;
    }

    // Method untuk menghapus tipe suku cadang berdasarkan UUID
    static async delete(uuid) {
        const sql = `
            DELETE FROM sparepart_type
            WHERE uuid = ?
        `;
        const result = await query(sql, [uuid]);
        return result.affectedRows > 0;
    }

    // Method untuk mengambil semua tipe suku cadang dari database
    static async getAllTypes() {
        const sql = 'SELECT * FROM sparepart_type';
        const types = await query(sql);
        return types;
    }
}

module.exports = SparepartType;
