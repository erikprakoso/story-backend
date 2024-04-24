const Sparepart = require('../models/sparepart');

// Controller untuk melihat semua suku cadang
exports.getAllSpareparts = async (req, res) => {
    try {
        // Ambil semua suku cadang dari database
        const spareparts = await Sparepart.getAll();

        res.json(spareparts);
    } catch (error) {
        console.error('Error fetching spareparts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Controller untuk melihat detail suku cadang berdasarkan UUID
exports.getSparepartById = async (req, res) => {
    try {
        const { uuid } = req.params;

        // Ambil suku cadang berdasarkan UUID
        const sparepart = await Sparepart.getById(uuid);

        if (sparepart) {
            res.json(sparepart);
        } else {
            res.status(404).json({ error: 'Sparepart not found' });
        }
    } catch (error) {
        console.error('Error fetching sparepart:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Controller untuk menambah suku cadang baru
exports.addSparepart = async (req, res) => {
    try {
        const newSparepart = req.body;

        // Tambah suku cadang baru ke database
        const uuid = await Sparepart.create(newSparepart);

        res.status(201).json({ message: 'Sparepart added successfully', uuid });
    } catch (error) {
        console.error('Error adding sparepart:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Controller untuk menambah suku cadang secara massal dari file
exports.addSparepartsBulk = async (req, res) => {
    try {
        const bulkSpareparts = req.body;

        // Tambah suku cadang secara massal ke database
        const result = await Sparepart.addBulkSpareparts(bulkSpareparts);

        res.status(201).json({ message: 'Spareparts added successfully', result });
    } catch (error) {
        console.error('Error adding spareparts in bulk:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Controller untuk mengedit informasi suku cadang
exports.editSparepart = async (req, res) => {
    try {
        const { uuid } = req.params;
        const updates = req.body;

        // Perbarui informasi suku cadang berdasarkan UUID
        const success = await Sparepart.update(uuid, updates);

        if (success) {
            res.json({ message: 'Sparepart updated successfully' });
        } else {
            res.status(404).json({ error: 'Sparepart not found' });
        }
    } catch (error) {
        console.error('Error editing sparepart:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Controller untuk menghapus suku cadang
exports.deleteSparepart = async (req, res) => {
    try {
        const { uuid } = req.params;

        // Hapus suku cadang berdasarkan UUID
        const success = await Sparepart.delete(uuid);

        if (success) {
            res.json({ message: 'Sparepart deleted successfully' });
        } else {
            res.status(404).json({ error: 'Sparepart not found' });
        }
    } catch (error) {
        console.error('Error deleting sparepart:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Controller untuk melihat semua jenis suku cadang
exports.getAllSparepartTypes = async (req, res) => {
    try {
        // Ambil semua jenis suku cadang dari database
        const types = await Sparepart.getAllTypes();

        res.json(types);
    } catch (error) {
        console.error('Error fetching sparepart types:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
