const SparepartType = require('../models/sparepartType');

// Controller untuk menambah tipe suku cadang baru
exports.addSparepartType = async (req, res) => {
    try {
        const newType = req.body;

        // Tambah tipe suku cadang baru ke database
        const uuid = await SparepartType.create(newType);

        res.status(201).json({ message: 'Sparepart type added successfully', uuid });
    } catch (error) {
        console.error('Error adding sparepart type:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Controller untuk mengedit tipe suku cadang berdasarkan UUID
exports.editSparepartType = async (req, res) => {
    try {
        const { uuid } = req.params;
        const updates = req.body;

        // Perbarui informasi tipe suku cadang berdasarkan UUID
        const success = await SparepartType.update(uuid, updates);

        if (success) {
            res.json({ message: 'Sparepart type updated successfully' });
        } else {
            res.status(404).json({ error: 'Sparepart type not found' });
        }
    } catch (error) {
        console.error('Error editing sparepart type:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Controller untuk menghapus tipe suku cadang berdasarkan UUID
exports.deleteSparepartType = async (req, res) => {
    try {
        const { uuid } = req.params;

        // Hapus tipe suku cadang berdasarkan UUID
        const success = await SparepartType.delete(uuid);

        if (success) {
            res.json({ message: 'Sparepart type deleted successfully' });
        } else {
            res.status(404).json({ error: 'Sparepart type not found' });
        }
    } catch (error) {
        console.error('Error deleting sparepart type:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Controller untuk melihat semua tipe suku cadang
exports.getAllSparepartTypes = async (req, res) => {
    try {
        // Ambil semua tipe suku cadang dari database
        const types = await SparepartType.getAllTypes();

        res.json(types);
    } catch (error) {
        console.error('Error fetching sparepart types:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};