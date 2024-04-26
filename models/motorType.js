const db = require('./db');
const { v4: uuidv4 } = require('uuid');

class MotorType {
    constructor(uuid, name) {
        this.uuid = uuid;
        this.name = name;
    }

    static async create(name) {
        return new Promise((resolve, reject) => {
            const uuid = uuidv4();
            db.query(
                'INSERT INTO motor_type (uuid, name) VALUES (?, ?)',
                [uuid, name],
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

    static async update(uuid, updates) {
        return new Promise((resolve, reject) => {
            const { name } = updates;
            db.query(
                'UPDATE motor_type SET name = ? WHERE uuid = ?',
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

    static async delete(uuid) {
        return new Promise((resolve, reject) => {
            db.query(
                'DELETE FROM motor_type WHERE uuid = ?',
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

    static async getAllTypes() {
        return new Promise((resolve, reject) => {
            db.query('SELECT uuid, name FROM motor_type', (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    }
}

module.exports = MotorType;
