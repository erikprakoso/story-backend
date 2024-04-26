const db = require('./db');
const { v4: uuidv4 } = require('uuid');

class SparepartType {
    constructor(uuid, name) {
        this.uuid = uuid;
        this.name = name;
    }

    // Method untuk menambah tipe suku cadang ke database
    static async create(type) {
        return new Promise((resolve, reject) => {
            const uuid = uuidv4();
            db.query(
                'INSERT INTO sparepart_type (uuid, name) VALUES (?, ?)',
                [uuid, type],
                (error, results) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(uuid);
                    }
                }
            );
        });
    }

    // Method untuk memperbarui tipe suku cadang berdasarkan UUID
    static async update(uuid, updates) {
        return new Promise((resolve, reject) => {
            const { name } = updates;
            db.query(
                'UPDATE sparepart_type SET name = ? WHERE uuid = ?',
                [name, uuid],
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

    // Method untuk menghapus tipe suku cadang berdasarkan UUID
    static async delete(uuid) {
        return new Promise((resolve, reject) => {
            db.query(
                'DELETE FROM sparepart_type WHERE uuid = ?',
                [uuid],
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

    // Method untuk mengambil semua tipe suku cadang dari database
    static async getAllTypes() {
        return new Promise((resolve, reject) => {
            db.query('SELECT uuid, name FROM sparepart_type', (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    }
}

module.exports = SparepartType;
