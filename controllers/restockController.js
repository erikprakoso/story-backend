const Restock = require('../models/restock');
const RestockDetail = require('../models/restockDetail');

// Controller untuk menambah data restock baru
exports.addRestock = async (req, res) => {
    try {
        const newRestock = req.body;

        const { date, spareparts, total_price, is_paid, supplier, uuid_user } = newRestock;

        if (!date) {
            return res.status(400).json({ code: 400, status: 'error', message: 'Date is required' });
        }

        if (!total_price) {
            return res.status(400).json({ code: 400, status: 'error', message: 'Total price is required' });
        }

        if (!is_paid) {
            return res.status(400).json({ code: 400, status: 'error', message: 'Is paid is required' });
        }

        if (!supplier) {
            return res.status(400).json({ code: 400, status: 'error', message: 'Supplier is required' });
        }

        if (Array.isArray(spareparts)) {
            if (spareparts.length === 0) {
                return res.status(400).json({ code: 400, status: 'error', message: 'Spareparts are required' });
            }
        }

        if (!uuid_user) {
            return res.status(400).json({ code: 400, status: 'error', message: 'User is required' });
        }

        const data = {
            uuid_user,
            date,
            total_price,
            is_paid,
            supplier
        };

        // Tambah data restock baru ke database
        const uuid = await Restock.create(data);

        if (!uuid) {
            return res.status(500).json({ code: 500, status: 'error', message: 'Failed to add restock' });
        }

        // Tambah detail suku cadang pada restock
        const promises = spareparts.map(async (sparepart) => {
            const { uuid_sparepart, quantity, buy_price } = sparepart;

            if (!uuid_sparepart) {
                return res.status(400).json({ code: 400, status: 'error', message: 'Sparepart is required' });
            }

            if (!quantity) {
                return res.status(400).json({ code: 400, status: 'error', message: 'Quantity is required' });
            }

            if (!buy_price) {
                return res.status(400).json({ code: 400, status: 'error', message: 'Buy price is required' });
            }

            const detail = {
                uuid_restock: uuid,
                uuid_sparepart,
                quantity,
                buy_price
            };

            return RestockDetail.create(detail);
        });

        await Promise.all(promises);

        res.status(201).json({ code: 201, status: 'success', message: 'Restock added successfully' });
    } catch (error) {
        console.error('Error adding restock:', error);
        res.status(500).json({ code: 500, status: 'error', message: 'Internal Server Error' });
    }
};

// Controller untuk mengedit informasi restock
exports.editRestock = async (req, res) => {
    try {
        const { uuid } = req.params;
        const updates = req.body;

        const { date, spareparts, total_price, is_paid, supplier, uuid_user } = updates; 

        if (!date) {
            return res.status(400).json({ code: 400, status: 'error', message: 'Date is required' });
        }

        if (!total_price) {
            return res.status(400).json({ code: 400, status: 'error', message: 'Total price is required' });
        }

        if (!is_paid) {
            return res.status(400).json({ code: 400, status: 'error', message: 'Is paid is required' });
        }

        if (!supplier) {
            return res.status(400).json({ code: 400, status: 'error', message: 'Supplier is required' });
        }

        if (Array.isArray(spareparts)) {
            if (spareparts.length === 0) {
                return res.status(400).json({ code: 400, status: 'error', message: 'Spareparts are required' });
            }
        }

        if (!uuid_user) {
            return res.status(400).json({ code: 400, status: 'error', message: 'User is required' });
        }

        const data = {
            uuid_user,
            date,
            total_price,
            is_paid,
            supplier
        };

        // Perbarui informasi restock berdasarkan UUID
        const success = await Restock.update(uuid, data);

        if (!success) {
            return res.status(500).json({ code: 500, status: 'error', message: 'Failed to edit restock' });
        }

        // Hapus detail suku cadang pada restock
        await RestockDetail.deleteByRestock(uuid);

        // Tambah detail suku cadang pada restock
        const promises = spareparts.map(async (sparepart) => {
            const { uuid_sparepart, quantity, buy_price } = sparepart;

            if (!uuid_sparepart) {
                return res.status(400).json({ code: 400, status: 'error', message: 'Sparepart is required' });
            }

            if (!quantity) {
                return res.status(400).json({ code: 400, status: 'error', message: 'Quantity is required' });
            }

            if (!buy_price) {
                return res.status(400).json({ code: 400, status: 'error', message: 'Buy price is required' });
            }

            const detail = {
                uuid_restock: uuid,
                uuid_sparepart,
                quantity,
                buy_price
            };

            return RestockDetail.create(detail);
        });

        await Promise.all(promises);

        res.json({ code: 200, status: 'success', message: 'Restock edited successfully' });
    } catch (error) {
        console.error('Error editing restock:', error);
        res.status(500).json({ code: 500, status: 'error', message: 'Internal Server Error' });
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
