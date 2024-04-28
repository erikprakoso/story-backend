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
                        const { uuid, uuid_user, date, total_price, is_paid, supplier, phone_number } = results[0];
                        resolve(new Restock(uuid, uuid_user, date, total_price, is_paid, supplier, phone_number));
                    } else {
                        resolve(null);
                    }
                }
            });
        });
    }
}

module.exports = Restock;
