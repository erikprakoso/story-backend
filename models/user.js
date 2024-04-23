const db = require('./db');

class User {
    constructor(uuid, username, password, name, rolename, phone_number) {
        this.uuid = uuid;
        this.username = username;
        this.password = password;
        this.name = name;
        this.rolename = rolename;
        this.phone_number = phone_number;
    }

    static async findByUsername(username) {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM user WHERE username = ?', [username], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    if (results.length > 0) {
                        const { uuid, username, password, name, rolename, phone_number } = results[0];
                        const user = new User(uuid, username, password, name, rolename, phone_number);
                        resolve(user);
                    } else {
                        resolve(null);
                    }
                }
            });
        });
    }

    static async findById(id) {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM user WHERE uuid = ?', [id], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    if (results.length > 0) {
                        const { uuid, username, password, name, rolename, phone_number } = results[0];
                        const user = new User(uuid, username, password, name, rolename, phone_number);
                        resolve(user);
                    } else {
                        resolve(null);
                    }
                }
            });
        });
    }

    static async create(username, password, name, rolename, phone_number) {
        return new Promise((resolve, reject) => {
            bcrypt.hash(password, 10, (hashError, hashedPassword) => {
                if (hashError) {
                    reject(hashError);
                } else {
                    const uuid = uuidv4(); // Generate UUID for the user
                    db.query(
                        'INSERT INTO user (uuid, username, password, name, rolename, phone_number) VALUES (?, ?, ?, ?, ?, ?)',
                        [uuid, username, hashedPassword, name, rolename, phone_number],
                        (insertError, results) => {
                            if (insertError) {
                                reject(insertError);
                            } else {
                                resolve(uuid); // Resolve with the UUID of the newly created user
                            }
                        }
                    );
                }
            });
        });
    }

    static async update(uuid, updates) {
        return new Promise((resolve, reject) => {
            db.query('UPDATE user SET ? WHERE uuid = ?', [updates, uuid], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results.affectedRows > 0);
                }
            });
        });
    }

    static async delete(uuid) {
        return new Promise((resolve, reject) => {
            db.query('DELETE FROM user WHERE uuid = ?', [uuid], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results.affectedRows > 0);
                }
            });
        });
    }
}

module.exports = User;
