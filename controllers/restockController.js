const Restock = require('../models/restock');

// Controller untuk menambah data restock baru
exports.addRestock = async (req, res) => {
    try {
        const newRestock = req.body;

        // Tambah data restock baru ke database
        const uuid = await Restock.create(newRestock);

        res.status(201).json({ message: 'Restock added successfully', uuid });
    } catch (error) {
        console.error('Error adding restock:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Controller untuk mengedit informasi restock
exports.editRestock = async (req, res) => {
    try {
        const { uuid } = req.params;
        const updates = req.body;

        // Perbarui informasi restock berdasarkan UUID
        const success = await Restock.update(uuid, updates);

        if (success) {
            res.json({ message: 'Restock updated successfully' });
        } else {
            res.status(404).json({ error: 'Restock not found' });
        }
    } catch (error) {
        console.error('Error editing restock:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Controller untuk menghapus restock
exports.deleteRestock = async (req, res) => {
    try {
        const { uuid } = req.params;

        // Hapus restock berdasarkan UUID
        const success = await Restock.delete(uuid);

        if (success) {
            res.json({ message: 'Restock deleted successfully' });
        } else {
            res.status(404).json({ error: 'Restock not found' });
        }
    } catch (error) {
        console.error('Error deleting restock:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Controller untuk melihat semua data restock
exports.getAllRestocks = async (req, res) => {
    try {
        // Ambil semua data restock dari database
        const restocks = await Restock.getAll();

        res.json(restocks);
    } catch (error) {
        console.error('Error fetching restocks:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Controller untuk melihat detail restock berdasarkan UUID
exports.getRestockById = async (req, res) => {
    try {
        const { uuid } = req.params;

        // Ambil data restock berdasarkan UUID
        const restock = await Restock.getById(uuid);

        if (restock) {
            res.json(restock);
        } else {
            res.status(404).json({ error: 'Restock not found' });
        }
    } catch (error) {
        console.error('Error fetching restock:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Controller untuk melihat detail suku cadang pada restock berdasarkan UUID restock
exports.getRestockSpareparts = async (req, res) => {
    try {
        const { uuid } = req.params;

        // Ambil detail suku cadang pada restock berdasarkan UUID restock
        const spareparts = await Restock.getSpareparts(uuid);

        res.json(spareparts);
    } catch (error) {
        console.error('Error fetching restock spareparts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
