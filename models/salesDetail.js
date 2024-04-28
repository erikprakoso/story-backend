const { query } = require('./db');

class SalesDetail {
    // Constructor untuk SalesDetail
    constructor(uuid_sales, uuid_sparepart, quantity, price) {
        this.uuid_sales = uuid_sales;
        this.uuid_sparepart = uuid_sparepart;
        this.quantity = quantity;
        this.price = price;
    }

    // Method untuk menambah data sales detail baru ke database
    static async create(salesDetail) {
        return new Promise((resolve, reject) => {
            const { uuid_sales, uuid_sparepart, quantity, price } = salesDetail;
            query(
                'INSERT INTO sales_detail (uuid_sales, uuid_sparepart, quantity, price) VALUES (?, ?, ?, ?)',
                [uuid_sales, uuid_sparepart, quantity, price],
                (error, results) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(uuid_sales);
                    }
                }
            );
        });
    }

    // Method untuk mengambil semua data sales detail dari database
    static async getAll() {
        return new Promise((resolve, reject) => {
            query('SELECT * FROM sales_detail', (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    }

    // Method untuk mengambil data sales detail berdasarkan UUID dari database
    static async getById(uuid) {
        return new Promise((resolve, reject) => {
            query('SELECT * FROM sales_detail WHERE uuid = ?', [uuid], (error, results) => {
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

    static async deleteBySales(uuid_sales) {
        return new Promise((resolve, reject) => {
            query('DELETE FROM sales_detail WHERE uuid_sales = ?', [uuid_sales], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(uuid_sales);
                }
            });
        });
    }

    static async getBySales(uuid_sales) {
        return new Promise((resolve, reject) => {
            query('SELECT * FROM sales_detail WHERE uuid_sales = ?', [uuid_sales], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    }

    // join sales_detail with sparepart
    static async getDetailsBySalesWithSparepart(uuid_sparepart) {
        return new Promise((resolve, reject) => {
            query(
                'SELECT sd.*, s.name FROM sales_detail sd JOIN sparepart s ON sd.uuid_sparepart = s.uuid WHERE sd.uuid_sales = ?',
                [uuid_sparepart],
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
}

module.exports = SalesDetail;