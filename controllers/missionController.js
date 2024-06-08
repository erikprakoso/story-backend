const mission = require('../models/mission');
const userMissionLink = require('../models/userMissionLink');
const userStoryLink = require('../models/userStoryLink');
const dotenv = require('dotenv');

// Mengakses variabel lingkungan jika menggunakan dotenv
dotenv.config();

exports.getMissionsByUserId = async (req, res) => {
    const { user_id } = req.params;

    try {
        const userMissions = await userMissionLink.findManyByUserId(user_id);

        if (userMissions.length === 0) {
            return res.json({
                code: 404,
                status: 'error',
                message: 'No missions found',
                data: null
            });
        }

        const missions = await mission.findMany();

        const userStoryLinks = await userStoryLink.findManyByUserId(user_id);

        if (userStoryLinks.length === 0) {
            return res.json({
                code: 404,
                status: 'error',
                message: 'No story links found',
                data: null
            });
        }

        // Membuat salinan misi untuk dimodifikasi
        const userMissionsCopy = JSON.parse(JSON.stringify(missions));

        // Menentukan misi yang sesuai berdasarkan jumlah cerita yang telah dibaca
        userMissionsCopy.forEach((userMission, index) => {
            const storySlice = userStoryLinks.slice(0, userMission.condition);
            userMission.data = storySlice;
            userStoryLinks.splice(0, storySlice.length); // Menghapus cerita yang telah ditambahkan
        });

        // Mengirimkan respons dengan data misi yang sesuai
        return res.json({
            code: 200,
            status: 'success',
            message: 'Missions fetched successfully',
            data: userMissionsCopy
        });

    } catch (error) {
        console.error('Error fetching missions:', error);
        res.status(500).json({
            code: 500,
            status: 'error',
            message: 'Internal server error'
        });
    }
}
