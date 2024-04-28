const { query } = require('./db');

class RestockDetail {
    constructor(uuid_restock, uuid_sparepart, quantity) {
        this.uuid_restock = uuid_restock;
        this.uuid_sparepart = uuid_sparepart;
        this.quantity = quantity;
        this.buy_price = buy_price;
    }

    static async create(restockDetail) {
        return new Promise((resolve, reject) => {
            query(
                'INSERT INTO restock_detail (uuid_restock, uuid_sparepart, quantity, buy_price) VALUES (?, ?, ?, ?)',
                [restockDetail.uuid_restock, restockDetail.uuid_sparepart, restockDetail.quantity, restockDetail.buy_price],
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

    static async delete(uuid_restock) {
        return new Promise((resolve, reject) => {
            query(
                'DELETE FROM restock_detail WHERE uuid_restock = ?',
                [uuid_restock],
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

    static async getAllDetails() {
        return new Promise((resolve, reject) => {
            query('SELECT * FROM restock_detail', (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    }

    static async getDetailsByRestock(uuid_restock) {
        return new Promise((resolve, reject) => {
            query('SELECT * FROM restock_detail WHERE uuid_restock = ?', [uuid_restock], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    }

    static async getDetailsBySparepart(uuid_sparepart) {
        return new Promise((resolve, reject) => {
            query('SELECT * FROM restock_detail WHERE uuid_sparepart = ?', [uuid_sparepart], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    }

    static async deleteByRestock(uuid_restock) {
        return new Promise((resolve, reject) => {
            query('DELETE FROM restock_detail WHERE uuid_restock = ?', [uuid_restock], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results.affectedRows > 0);
                }
            });
        });
    }

    // join restock_detail with sparepart
    static async getDetailsByRestockWithSparepart(uuid_restock) {
        return new Promise((resolve, reject) => {
            query(
                'SELECT rd.*, s.name FROM restock_detail rd JOIN sparepart s ON rd.uuid_sparepart = s.uuid WHERE rd.uuid_restock = ?',
                [uuid_restock],
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

module.exports = RestockDetail;