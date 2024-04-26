const MotorType = require('../models/motorType');

// Controller untuk menambah jenis suku cadang motor baru
exports.addMotorType = async (req, res) => {
    try {
        const { name } = req.body;
        
        // Tambah jenis suku cadang motor baru ke database
        const uuid = await MotorType.create( name );

        res.status(201).json({code: 201, status: 'success', message: 'Sparepart motor type added successfully', uuid});
    } catch (error) {
        console.error('Error adding sparepart motor type:', error);
        res.status(500).json({ ccode: 500, status: 'error', message: 'Internal Server Error' });
    }
};

// Controller untuk mengedit informasi jenis suku cadang motor
exports.editMotorType = async (req, res) => {
    try {
        const { uuid } = req.params;
        const { name } = req.body;

        // Perbarui informasi jenis suku cadang motor berdasarkan UUID
        const success = await MotorType.update(uuid, { name });

        if (success) {
            res.json({ code: 200, status: 'success', message: 'Sparepart motor type updated successfully' });
        } else {
            res.status(404).json({ code: 404, status: 'error', message: 'Sparepart motor type not found' });
        }
    } catch (error) {
        console.error('Error editing sparepart motor type:', error);
        res.status(500).json({ code: 500, status: 'error', message: 'Internal Server Error' });
    }
};

// Controller untuk menghapus jenis suku cadang motor
exports.deleteMotorType = async (req, res) => {
    try {
        const { uuid } = req.params;

        // Hapus jenis suku cadang motor berdasarkan UUID
        const success = await MotorType.delete(uuid);

        if (success) {
            res.json({ code: 200, status: 'success', message: 'Sparepart motor type deleted successfully' });
        } else {
            res.status(404).json({ code: 404, status: 'error', message: 'Sparepart motor type not found' });
        }
    } catch (error) {
        console.error('Error deleting sparepart motor type:', error);
        res.status(500).json({ code: 500, status: 'error', message: 'Internal Server Error' });
    }
};

// Controller untuk melihat semua jenis suku cadang motor
exports.getAllMotorTypes = async (req, res) => {
    try {
        // Ambil semua jenis suku cadang motor dari database
        const types = await MotorType.getAllTypes();

        if (types.length === 0) {
            return res.status(404).json({ code: 404, status: 'error', message: 'Sparepart motor types not found' });
        }

        res.json({ code: 200, status: 'success', data: types });
    } catch (error) {
        console.error('Error fetching sparepart motor types:', error);
        res.status(500).json({ code: 500, status: 'error', message: 'Internal Server Error' });
    }
};
