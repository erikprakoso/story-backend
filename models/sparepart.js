const { query } = require('./db');
const { v4: uuidv4 } = require('uuid');

class Sparepart {
    constructor(uuid, partnumber, name, uuid_sparepart_type, quantity, price, garage_price, install_price, shelf_location) {
        this.uuid = uuid;
        this.partnumber = partnumber;
        this.name = name;
        this.uuid_sparepart_type = uuid_sparepart_type;
        this.quantity = quantity;
        this.price = price;
        this.garage_price = garage_price;
        this.install_price = install_price;
        this.shelf_location = shelf_location;
    }

    // Method untuk menambah suku cadang baru ke database
    static async create(sparepart) {
        return new Promise((resolve, reject) => {
            const generatedUuid = uuidv4();
            const { partnumber, name, uuid_sparepart_type, quantity, price, garage_price, install_price, shelf_location } = sparepart;
            query(
                'INSERT INTO sparepart (uuid, partnumber, name, uuid_sparepart_type, quantity, price, garage_price, install_price, shelf_location, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
                [generatedUuid, partnumber, name, uuid_sparepart_type, quantity, price, garage_price, install_price, shelf_location],
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

    // Method untuk mengambil semua suku cadang dari database
    static async getAll() {
        return new Promise((resolve, reject) => {
            query('SELECT * FROM sparepart', (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    }

    // Method untuk mengambil suku cadang berdasarkan UUID dari database
    static async getById(uuid) {
        return new Promise((resolve, reject) => {
            query('SELECT * FROM sparepart WHERE uuid = ?', [uuid], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    if (results.length > 0) {
                        const { uuid, partnumber, name, uuid_sparepart_type, quantity, price, garage_price, install_price, shelf_location } = results[0];
                        resolve(new Sparepart(uuid, partnumber, name, uuid_sparepart_type, quantity, price, garage_price, install_price, shelf_location));
                    } else {
                        resolve(null);
                    }
                }
            });
        });
    }

    // Method untuk memperbarui informasi suku cadang berdasarkan UUID di database
    static async update(uuid, updates) {
        return new Promise((resolve, reject) => {
            const { partnumber, name, uuid_sparepart_type, quantity, price, garage_price, install_price, shelf_location } = updates;
            query(
                'UPDATE sparepart SET partnumber = ?, name = ?, uuid_sparepart_type = ?, quantity = ?, price = ?, garage_price = ?, install_price = ?, shelf_location = ?, updated_at = NOW() WHERE uuid = ?',
                [partnumber, name, uuid_sparepart_type, quantity, price, garage_price, install_price, shelf_location, uuid],
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

    // Method untuk menghapus suku cadang berdasarkan UUID dari database
    static async delete(uuid) {
        return new Promise((resolve, reject) => {
            query('DELETE FROM sparepart WHERE uuid = ?', [uuid], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results.affectedRows > 0);
                }
            });
        });
    }

    // Method untuk menambah suku cadang secara massal ke database
    static async addBulkSpareparts(sparepart) {
        return new Promise((resolve, reject) => {
            const generatedUuid = uuidv4();
            const { partnumber, name, uuid_sparepart_type, quantity, price, garage_price, install_price, shelf_location } = sparepart;
            query(
                'INSERT INTO sparepart (uuid, partnumber, name, uuid_sparepart_type, quantity, price, garage_price, install_price, shelf_location, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
                [generatedUuid, partnumber, name, uuid_sparepart_type, quantity, price, garage_price, install_price, shelf_location],
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
}

module.exports = Sparepart;
