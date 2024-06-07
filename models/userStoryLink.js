const { connection, query } = require('../config/database');

class UserStoryLink {
    constructor(userId, storyId) {
        this.userId = userId;
        this.storyId = storyId;
    }

    static async create(userId, storyId) {
        return new Promise((resolve, reject) => {
            query('INSERT IGNORE INTO user_story_links (user_id, story_id) VALUES (?, ?)', [userId, storyId], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    const { affectedRows } = results;
                    resolve(affectedRows);
                }
            });
        });
    }
}

module.exports = UserStoryLink;