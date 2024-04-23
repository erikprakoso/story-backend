const { query } = require('./db');

class Restock {
    // Method untuk menambah data restock baru ke database
    static async create(restock) {
        const { uuid_user, date, total_price, is_paid, supplier, phone_number } = restock;
        const sql = `
      INSERT INTO restock (uuid_user, date, total_price, is_paid, supplier, phone_number, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;
        const result = await query(sql, [uuid_user, date, total_price, is_paid, supplier, phone_number]);
        return result.insertId;
    }

    // Method untuk mengambil semua data restock dari database
    static async getAll() {
        const sql = 'SELECT * FROM restock';
        const restocks = await query(sql);
        return restocks;
    }

    // Method untuk mengambil data restock berdasarkan UUID dari database
    static async getById(uuid) {
        const sql = 'SELECT * FROM restock WHERE uuid = ?';
        const [restock] = await query(sql, [uuid]);
        return restock;
    }

    // Method untuk memperbarui informasi restock berdasarkan UUID di database
    static async update(uuid, updates) {
        const sql = 'UPDATE restock SET ? WHERE uuid = ?';
        const result = await query(sql, [updates, uuid]);
        return result.affectedRows > 0;
    }

    // Method untuk menghapus restock berdasarkan UUID dari database
    static async delete(uuid) {
        const sql = 'DELETE FROM restock WHERE uuid = ?';
        const result = await query(sql, [uuid]);
        return result.affectedRows > 0;
    }

    // Method untuk mengambil detail suku cadang pada restock berdasarkan UUID restock dari database
    static async getSpareparts(uuid) {
        const sql = `
      SELECT s.uuid, s.name, rd.quantity, rd.buy_price
      FROM restock_detail rd
      INNER JOIN sparepart s ON rd.uuid_sparepart = s.uuid
      WHERE rd.uuid_restock = ?
    `;
        const spareparts = await query(sql, [uuid]);
        return spareparts;
    }
}

module.exports = Restock;
