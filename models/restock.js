const { query } = require('./db');
const { v4: uuidv4 } = require('uuid');

class Restock {
    // Constructor untuk Restock
    constructor(uuid, uuid_user, date, total_price, is_paid, supplier, phone_number) {
        this.uuid = uuid;
        this.uuid_user = uuid_user;
        this.date = date;
        this.total_price = total_price;
        this.is_paid = is_paid;
        this.supplier = supplier;
        this.phone_number = phone_number;
    }

    // Method untuk menambah data restock baru ke database
    static async create(restock) {
        return new Promise((resolve, reject) => {
            const generatedUuid = uuidv4();
            const { uuid_user, date, total_price, is_paid, supplier, phone_number } = restock;
            query(
                'INSERT INTO restock (uuid, uuid_user, date, total_price, is_paid, supplier, phone_number, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
                [generatedUuid, uuid_user, date, total_price, is_paid, supplier, phone_number],
                (error, results) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(generatedUuid);
                    }
                }
            );
        });
    }

    // Method untuk mengambil semua data restock dari database
    static async getAll() {
        return new Promise((resolve, reject) => {
            query('SELECT * FROM restock', (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    }

    // Method untuk mengambil data restock berdasarkan UUID dari database
    static async getById(uuid) {
        return new Promise((resolve, reject) => {
            query('SELECT * FROM restock WHERE uuid = ?', [uuid], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    if (results.length > 0) {
                        resolve(results[0]);
                    } else {
                        resolve(null);
                    }
                }
            });
        });
    }

    // Method untuk mengupdate data restock berdasarkan UUID dari database
    static async update(uuid, restock) {
        return new Promise((resolve, reject) => {
            const { uuid_user, date, total_price, is_paid, supplier, phone_number } = restock;
            query(
                'UPDATE restock SET uuid_user = ?, date = ?, total_price = ?, is_paid = ?, supplier = ?, phone_number = ?, updated_at = NOW() WHERE uuid = ?',
                [uuid_user, date, total_price, is_paid, supplier, phone_number, uuid],
                (error, results) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(results.affectedRows > 0);
                    }
                }
            );
        });
    }

    // Method untuk menghapus data restock berdasarkan UUID dari database
    static async delete(uuid) {
        return new Promise((resolve, reject) => {
            query('DELETE FROM restock WHERE uuid = ?', [uuid], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results.affectedRows > 0);
                }
            });
        });
    }

    // Method untuk mengambil semua data restock, detail restock dan sparepart berdasarkan uuid restock dari database
    static async getDetails(uuid) {
        return new Promise((resolve, reject) => {
            query(
                'SELECT r.uuid, r.uuid_user, r.date, r.total_price, r.is_paid, r.supplier, r.phone_number, rd.uuid_sparepart, rd.quantity, s.name, s.price FROM restock r INNER JOIN restock_detail rd ON r.uuid = rd.uuid_restock INNER JOIN sparepart s ON rd.uuid_sparepart = s.uuid WHERE r.uuid = ?',
                [uuid],
                (error, results) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(results);
                    }
                }
            );
        });
    }

    // Method untuk merubah status is_paid restock berdasarkan UUID dari database
    static async updateIsPaid(uuid, is_paid) {
        return new Promise((resolve, reject) => {
            query(
                'UPDATE restock SET is_paid = ?, updated_at = NOW() WHERE uuid = ?',
                [is_paid, uuid],
                (error, results) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(results.affectedRows > 0);
                    }
                }
            );
        });
    }
}

module.exports = Restock;
