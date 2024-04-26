const Sparepart = require('../models/sparepart');
const { query } = require('../models/db');
const SparepartDetail = require('../models/sparepartDetail');

// Controller for viewing all spare parts with pagination, search, and filtering
exports.getAllSpareparts = async (req, res) => {
    try {
        const { page, limit, search, type } = req.query;
        let conditions = [];

        // Membuat array untuk menyimpan kondisi-kondisi SQL
        let sqlConditions = [];

        // Menambahkan kondisi pencarian jika ada parameter 'search'
        if (search) {
            sqlConditions.push(`name LIKE '%${search}%'`);
        }

        // Menambahkan kondisi filtering berdasarkan 'type'
        if (type) {
            sqlConditions.push(`uuid_sparepart_type = '${type}'`);
        }

        // Menggabungkan kondisi-kondisi SQL menjadi sebuah string
        if (sqlConditions.length > 0) {
            conditions.push(`WHERE ${sqlConditions.join(' AND ')}`);
        }

        // Menghitung jumlah total sparepart
        const countQuery = `SELECT COUNT(*) AS total FROM sparepart ${conditions.join(' ')}`;
        const totalCountResult = await query(countQuery);
        const totalCount = totalCountResult[0].total;

        // Menyiapkan query untuk mengambil data sparepart dengan pagination
        const offset = (page - 1) * limit;
        const selectQuery = `SELECT * FROM sparepart ${conditions.join(' ')} LIMIT ${limit} OFFSET ${offset}`;
        const spareparts = await query(selectQuery);

        if (spareparts.length === 0) {
            return res.status(404).json({ code: 404, status: 'error', message: 'Spareparts not found' });
        }

        res.json({
            code: 200, status: 'success', data: spareparts,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                totalItems: totalCount,
                totalPages: Math.ceil(totalCount / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching spareparts:', error);
        res.status(500).json({ code: 500, status: 'error', message: 'Internal Server Error' });
    }
};


// Controller untuk melihat detail suku cadang berdasarkan UUID
exports.getSparepartById = async (req, res) => {
    try {
        const { uuid } = req.params;

        // Ambil suku cadang berdasarkan UUID
        const sparepart = await Sparepart.getById(uuid);

        if (sparepart) {
        res.json({ code: 200, status: 'success', message: 'Sparepart found', data: sparepart });
            res.status(404).json({ code: 404, status: 'error', message: 'Sparepart not found' });
        }
    } catch (error) {
        console.error('Error fetching sparepart:', error);
        res.status(500).json({ code: 500, status: 'error', message: 'Internal Server Error' });
    }
};

// Controller untuk menambah suku cadang baru
exports.addSparepart = async (req, res) => {
    try {
        const newSparepart = req.body;

        const { partnumber, name, uuid_sparepart_type, quantity, price, garage_price, install_price, shelf_location, motor_type } = newSparepart;

        // Validasi data yang diterima
        if (!partnumber) {
            return res.status(400).json({ code: 400, status: 'error', message: 'Partnumber is required' });
        }

        if (!name) {
            return res.status(400).json({ code: 400, status: 'error', message: 'Name is required' });
        }

        if (!shelf_location) {
            return res.status(400).json({ code: 400, status: 'error', message: 'Shelf location is required' });
        }

        const addSparepart = {
            partnumber,
            name,
            uuid_sparepart_type,
            quantity,
            price,
            garage_price,
            install_price,
            shelf_location
        };

        // Tambah suku cadang baru ke database
        const uuid = await Sparepart.create(addSparepart);

        if (!uuid) {
            return res.status(500).json({ code: 500, status: 'error', message: 'Failed to add sparepart' });
        }
        
        if (Array.isArray(motor_type) && motor_type.length > 0) {

            // Tambahkan jenis motor yang mendukung suku cadang ini
            const addSparepartDetail = motor_type.map((type) => {
                const data = { uuid_sparepart: uuid, uuid_motor_type: type };

                SparepartDetail.create(data)
                    .then((result) => {
                        console.log('Added sparepart detail:', result);
                    }
                );
            });
        
            // Handle error if adding sparepart detail fails
            if (!addSparepartDetail) {
                return res.status(500).json({ code: 500, status: 'error', message: 'Failed to add sparepart detail' });
            }
        }
        

        res.status(201).json({ code: 201, status: 'success', message: 'Sparepart added successfully', uuid });
    } catch (error) {
        console.error('Error adding sparepart:', error);
        res.status(500).json({ code: 500, status: 'error', message: 'Internal Server Error' });
    }
};

// Controller untuk menambah suku cadang secara massal dari file
exports.addSparepartsBulk = async (req, res) => {
    try {
        const bulkSpareparts = req.body;

        // Tambah suku cadang secara massal ke database
        const result = await Sparepart.addBulkSpareparts(bulkSpareparts);

        res.status(201).json({ code: 201, status: 'success', message: 'Spareparts added successfully', result });
    } catch (error) {
        console.error('Error adding spareparts in bulk:', error);
        res.status(500).json({ code: 500, status: 'error', message: 'Internal Server Error' });
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
            res.json({ code: 200, status: 'success', message: 'Sparepart updated successfully' });
        } else {
            res.status(404).json({ code: 404, status: 'error', message: 'Sparepart not found' });
        }
    } catch (error) {
        console.error('Error editing sparepart:', error);
        res.status(500).json({ code: 500, status: 'error', message: 'Internal Server Error' });
    }
};

// Controller untuk menghapus suku cadang
exports.deleteSparepart = async (req, res) => {
    try {
        const { uuid } = req.params;

        // Hapus suku cadang berdasarkan UUID
        const success = await Sparepart.delete(uuid);

        if (success) {
            res.json({ code: 200, status: 'success', message: 'Sparepart deleted successfully' });
        } else {
            res.status(404).json({ error: 'Sparepart not found' });
        }
    } catch (error) {
        console.error('Error deleting sparepart:', error);
        res.status(500).json({ code: 500, status: 'error', message: 'Internal Server Error' });
    }
};

// Controller untuk melihat semua jenis suku cadang
exports.getAllSparepartTypes = async (req, res) => {
    try {
        // Ambil semua jenis suku cadang dari database
        const types = await Sparepart.getAllTypes();

        res.json({ code: 200, status: 'success', data: types });
    } catch (error) {
        console.error('Error fetching sparepart types:', error);
        res.status(500).json({ code: 500, status: 'error', message: 'Internal Server Error' });
    }
};
