const Restock = require('../models/restock');
const RestockDetail = require('../models/restockDetail');
const { query } = require('../models/db');

// Controller untuk menambah data restock baru
exports.addRestock = async (req, res) => {
    try {
        const newRestock = req.body;

        const { date, spareparts, total_price, is_paid, supplier, uuid_user, phone_number } = newRestock;

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

        if (!phone_number) {
            return res.status(400).json({ code: 400, status: 'error', message: 'Phone number is required' });
        }

        const data = {
            uuid_user,
            date,
            total_price,
            is_paid,
            supplier,
            phone_number
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

        // Hapus detail suku cadang pada restock berdasarkan UUID
        const restockDetail = RestockDetail.deleteByRestock(uuid);

        if (!restockDetail) {
            return res.status(500).json({ code: 500, status: 'error', message: 'Failed to delete restock detail' });
        }

        // Hapus restock berdasarkan UUID
        const success = await Restock.delete(uuid);

        if (!success) {
            return res.status(500).json({ code: 500, status: 'error', message: 'Failed to delete restock' });
        }

        res.json({ code: 200, status: 'success', message: 'Restock deleted successfully' });
    } catch (error) {
        console.error('Error deleting restock:', error);
        res.status(500).json({ code: 500, status: 'error', message: 'Internal Server Error' });
    }
};

// Controller untuk melihat semua data restock
exports.getAllRestocks = async (req, res) => {
    try {
        const { page, limit, search, month, year, day } = req.query;

        let conditions = [];

        // Membuat array untuk menyimpan kondisi-kondisi SQL
        let sqlConditions = [];

        // Menambahkan kondisi pencarian jika ada parameter 'search'
        if (search) {
            sqlConditions.push(`supplier LIKE '%${search}%'`);
        }

        // Menambahkan kondisi pencarian berdasarkan bulan
        if (month) {
            sqlConditions.push(`EXTRACT(MONTH FROM date) = ${parseInt(month)}`);
        }

        // Menambahkan kondisi pencarian berdasarkan tahun
        if (year) {
            sqlConditions.push(`EXTRACT(YEAR FROM date) = ${parseInt(year)}`);
        }

        // Menambahkan kondisi pencarian berdasarkan hari
        if (day) {
            sqlConditions.push(`EXTRACT(DAY FROM date) = ${parseInt(day)}`);
        }

        // Menggabungkan kondisi-kondisi SQL menjadi sebuah string
        if (sqlConditions.length > 0) {
            conditions.push(`WHERE ${sqlConditions.join(' AND ')}`);
        }

        // Menghitung jumlah total Restock
        const countQuery = `SELECT COUNT(*) AS total FROM restock ${conditions.join(' ')}`;

        const totalCountResult = await query(countQuery);
        const totalCount = totalCountResult[0].total;

        // Menyiapkan query untuk mengambil data restock dengan pagination
        const offset = (page - 1) * limit;
        const restockQuery = `SELECT * FROM restock ${conditions.join(' ')} ORDER BY date DESC LIMIT ${limit} OFFSET ${offset}`;
        const restocks = await query(restockQuery);

        // Menggunakan Promise.all untuk menunggu hasil dari setiap operasi async
        await Promise.all(restocks.map(async (restock) => {
            const spareparts = await RestockDetail.getDetailsByRestockWithSparepart(restock.uuid);

            if (spareparts.length > 0) {
                restock.total_sparepart = spareparts.length;
                restock.spareparts = spareparts;
            }
        }
        ));

        res.json({
            code: 200, status: 'success', data: restocks,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                totalItems: totalCount,
                totalPages: Math.ceil(totalCount / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching restocks:', error);
        res.status(500).json({ code: 500, status: 'error', message: 'Internal Server Error' });
    }
};

// Controller untuk melihat detail restock berdasarkan UUID
exports.getRestockById = async (req, res) => {
    try {
        const { uuid } = req.params;

        // Ambil data restock berdasarkan UUID
        const restock = await Restock.getById(uuid);

        console.log(restock);

        if (!restock) {
            return res.status(404).json({ code: 404, status: 'error', message: 'Restock not found' });
        }

        const spareparts = await RestockDetail.getDetailsByRestockWithSparepart(uuid);

        if (spareparts.length > 0) {
            restock.total_sparepart = spareparts.length;
            restock.spareparts = spareparts;
        }

        res.json({ code: 200, status: 'success', data: restock });
    } catch (error) {
        console.error('Error fetching restock:', error);
        res.status(500).json({ code: 500, status: 'error', message: 'Internal Server Error' });
    }
};

// Controller untuk melihat detail suku cadang pada restock berdasarkan UUID restock
exports.getRestockSpareparts = async (req, res) => {
    try {
        const { uuid } = req.params;

        // Ambil detail suku cadang pada restock berdasarkan UUID restock
        const spareparts = await Restock.getDetails(uuid);

        if (!spareparts) {
            return res.status(404).json({ code: 404, status: 'error', message: 'Spareparts not found' });
        }

        res.json({ code: 200, status: 'success', data: spareparts });
    } catch (error) {
        console.error('Error fetching restock spareparts:', error);
        res.status(500).json({ code: 500, status: 'error', message: 'Internal Server Error' });
    }
};

exports.updateIsPaid = async (req, res) => {
    try {
        const { uuid } = req.params;
        const { is_paid } = req.body;

        if (is_paid === undefined) {
            return res.status(400).json({ code: 400, status: 'error', message: 'Is paid is required' });
        }

        const success = await Restock.updateIsPaid(uuid, is_paid);

        console.log(success);

        if (!success) {
            return res.status(500).json({ code: 500, status: 'error', message: 'Failed to update is paid' });
        }

        res.json({ code: 200, status: 'success', message: 'Is paid updated successfully' });
    } catch (error) {
        console.error('Error updating is paid:', error);
        res.status(500).json({ code: 500, status: 'error', message: 'Internal Server Error' });
    }
}