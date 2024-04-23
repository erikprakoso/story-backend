const { query } = require('./db');

class Sparepart {
    // Method untuk menambah suku cadang baru ke database
    static async create(sparepart) {
        const { partnumber, name, uuid_sparepart_type, quantity, price, garage_price, install_price, shelf_location } = sparepart;
        const sql = `
      INSERT INTO sparepart (partnumber, name, uuid_sparepart_type, quantity, price, garage_price, install_price, shelf_location, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;
        const result = await query(sql, [partnumber, name, uuid_sparepart_type, quantity, price, garage_price, install_price, shelf_location]);
        return result.insertId;
    }

    // Method untuk mengambil semua suku cadang dari database
    static async getAll() {
        const sql = 'SELECT * FROM sparepart';
        const spareparts = await query(sql);
        return spareparts;
    }

    // Method untuk mengambil suku cadang berdasarkan UUID dari database
    static async getById(uuid) {
        const sql = 'SELECT * FROM sparepart WHERE uuid = ?';
        const [sparepart] = await query(sql, [uuid]);
        return sparepart;
    }

    // Method untuk memperbarui informasi suku cadang berdasarkan UUID di database
    static async update(uuid, updates) {
        const sql = 'UPDATE sparepart SET ? WHERE uuid = ?';
        const result = await query(sql, [updates, uuid]);
        return result.affectedRows > 0;
    }

    // Method untuk menghapus suku cadang berdasarkan UUID dari database
    static async delete(uuid) {
        const sql = 'DELETE FROM sparepart WHERE uuid = ?';
        const result = await query(sql, [uuid]);
        return result.affectedRows > 0;
    }
}

module.exports = Sparepart;
