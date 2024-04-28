const { query } = require('./db');
const { v4: uuidv4 } = require('uuid');

class Sales {
    // Constructor untuk Sales
    constructor(uuid, date, uuid_user, customer_name, customer_phone_number, sales_type, total_price, discount, final_price, is_paid) {
            this.uuid = uuid;
            this.date = date;
            this.uuid_user = uuid_user;
            this.customer_name = customer_name;
            this.customer_phone_number = customer_phone_number;
            this.sales_type = sales_type;
            this.total_price = total_price;
            this.discount = discount;
            this.final_price = final_price;
            this.is_paid = is_paid || false;
    }

    // Method untuk menambah data sales baru ke database
    static async create(sales) {
        return new Promise((resolve, reject) => {
            const generatedUuid = uuidv4();
            const { uuid, date, uuid_user, customer_name, customer_phone_number, sales_type, total_price, discount, final_price, is_paid } = sales;
            query(
                'INSERT INTO sales (uuid, date, uuid_user, customer_name, customer_phone_number, sales_type, total_price, discount, final_price, is_paid, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
                [generatedUuid, date, uuid_user, customer_name, customer_phone_number, sales_type, total_price, discount, final_price, is_paid],
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

    // Method untuk mengambil semua data sales dari database
    static async getAll() {
        return new Promise((resolve, reject) => {
            query('SELECT * FROM sales', (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    }

    // Method untuk mengambil data sales berdasarkan UUID dari database
    static async getById(uuid) {
        return new Promise((resolve, reject) => {
            query('SELECT * FROM sales WHERE uuid = ?', [uuid], (error, results) => {
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

    // Method untuk mengupdate data sales berdasarkan UUID dari database
    static async update(uuid, sales) {
        return new Promise((resolve, reject) => {
            const { date, uuid_user, customer_name, customer_phone_number, sales_type, total_price, discount, final_price, is_paid } = sales;
            query(
                'UPDATE sales SET date = ?, uuid_user = ?, customer_name = ?, customer_phone_number = ?, sales_type = ?, total_price = ?, discount = ?, final_price = ?, is_paid = ?, updated_at = NOW() WHERE uuid = ?',
                [date, uuid_user, customer_name, customer_phone_number, sales_type, total_price, discount, final_price, is_paid, uuid],
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

    // Method untuk menghapus data sales berdasarkan UUID dari database
    static async delete(uuid) {
        return new Promise((resolve, reject) => {
            query('DELETE FROM sales WHERE uuid = ?', [uuid], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(uuid);
                }
            });
        });
    }

    // Method untuk merubah status is_paid restock berdasarkan UUID dari database
    static async updateIsPaid(uuid, is_paid) {
        return new Promise((resolve, reject) => {
            query('UPDATE sales SET is_paid = ?, updated_at = NOW() WHERE uuid = ?', [is_paid, uuid], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(uuid);
                }
            });
        });
    }
}

module.exports = Sales;