const { query } = require('./db');

class SparepartDetail {
    constructor(uuid_sparepart, uuid_motor_type) {
        this.uuid_sparepart = uuid_sparepart;
        this.uuid_motor_type = uuid_motor_type;
    }

    static async create(sparepartDetail) {
        return new Promise((resolve, reject) => {
            query(
                'INSERT INTO sparepart_detail (uuid_sparepart, uuid_motor_type) VALUES (?, ?)',
                [sparepartDetail.uuid_sparepart, sparepartDetail.uuid_motor_type],
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

    static async delete(uuid_sparepart) {
        return new Promise((resolve, reject) => {
            query(
                'DELETE FROM sparepart_detail WHERE uuid_sparepart = ?',
                [uuid_sparepart],
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
            query('SELECT * FROM sparepart_detail', (error, results) => {
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
            query('SELECT * FROM sparepart_detail WHERE uuid_sparepart = ?', [uuid_sparepart], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    }

    static async getDetailsByMotorType(uuid_motor_type) {
        return new Promise((resolve, reject) => {
            query('SELECT * FROM sparepart_detail WHERE uuid_motor_type = ?', [uuid_motor_type], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    }

    static async update(uuid_sparepart, updates) {
        return new Promise((resolve, reject) => {
            query(
                'UPDATE sparepart_detail SET uuid_motor_type = ? WHERE uuid_sparepart = ?',
                [updates.uuid_motor_type, uuid_sparepart],
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

    static async deleteBySparepart(uuid_sparepart) {
        return new Promise((resolve, reject) => {
            query(
                'DELETE FROM sparepart_detail WHERE uuid_sparepart = ?',
                [uuid_sparepart],
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

module.exports = SparepartDetail;