const Sparepart = require('../models/sparepart');
const { query } = require('../models/db');
const SparepartDetail = require('../models/sparepartDetail');
const xlsx = require('xlsx');
const csv = require('csv-parser');
const fs = require('fs');

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

        // Menggunakan Promise.all untuk menunggu hasil dari setiap operasi async
        await Promise.all(spareparts.map(async (sparepart) => {
            const uuid = sparepart.uuid;
            const motorTypes = await SparepartDetail.getDetailsWithMotorType(uuid);
            sparepart.motor_types = motorTypes;
        }));

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

        console.log(sparepart);

        if (!sparepart) {
            return res.status(404).json({ code: 404, status: 'error', message: 'Sparepart not found' });
        }

        const motorTypes = await SparepartDetail.getDetailsBySparepart(uuid);

        if (!motorTypes) {
            return res.status(500).json({ code: 500, status: 'error', message: 'Failed to get motor types' });
        }

        // Tambahkan jenis motor yang mendukung suku cadang ini ke property 'motor_types
        sparepart.motor_types = motorTypes;

        if (sparepart) {
            res.json({ code: 200, status: 'success', message: 'Sparepart found', data: sparepart });
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
        // Mendapatkan path berkas yang diunggah
        const filePath = req.file.path;
        const fileExt = req.file.originalname.split('.').pop().toLowerCase();

        // Jika berkas adalah Excel
        if (fileExt === 'xlsx' || fileExt === 'xls') {
            // Baca berkas Excel
            const workbook = xlsx.readFile(filePath);
            const sheetNames = workbook.SheetNames;
            const firstSheetName = sheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = xlsx.utils.sheet_to_json(worksheet);

            console.log('Data from Excel:', jsonData);

            if (jsonData.length === 0) {
                return res.status(400).json({ code: 400, status: 'error', message: 'No data found in Excel file' });
            }

            const entryPromises = jsonData.map((entry) => {
                const { partnumber, name, quantity, price, garage_price, install_price, shelf_location, motor_type } = entry;

                const addSparepart = {
                    partnumber,
                    name,
                    quantity,
                    price,
                    garage_price,
                    install_price,
                    shelf_location
                };

                // Tambahkan suku cadang baru ke database
                return Sparepart.create(addSparepart)
                    .then((uuid) => {
                        console.log('Added sparepart:', uuid);
                    });
            });

            // Tunggu sampai semua operasi selesai
            await Promise.all(entryPromises);

            // Hapus berkas yang diunggah
            fs.unlinkSync(filePath);

            res.json({ code: 200, status: 'success', message: 'Spareparts added successfully' });

            // Jika berkas adalah CSV
        } else if (fileExt === 'csv') {
            const results = [];

            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (data) => results.push(data))
                .on('end', () => {
                    // Sekarang, `results` berisi data dari berkas CSV yang dapat Anda proses dan tambahkan ke database sesuai dengan kebutuhan Anda
                    console.log('Data from CSV:', results);

                    // Simpan data ke database
                    results.forEach((entry) => {
                        const { partnumber, name, quantity, price, garage_price, install_price, shelf_location } = entry;

                        const addSparepart = {
                            partnumber,
                            name,
                            quantity,
                            price,
                            garage_price,
                            install_price,
                            shelf_location
                        };

                        // Tambahkan suku cadang baru ke database
                        Sparepart.create(addSparepart)
                            .then((uuid) => {
                                console.log('Added sparepart:', uuid);
                            });
                    });

                    // Hapus berkas yang diunggah
                    fs.unlinkSync(filePath);

                    res.json({ code: 200, status: 'success', message: 'Spareparts added successfully' });
                });

        } else {
            // Berkas tidak didukung
            return res.status(400).json({ code: 400, status: 'error', message: 'Unsupported file format' });
        }
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

        const { partnumber, name, uuid_sparepart_type, quantity, price, garage_price, install_price, shelf_location, motor_type } = updates;

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

        const updateSparepart = {
            partnumber,
            name,
            uuid_sparepart_type,
            quantity,
            price,
            garage_price,
            install_price,
            shelf_location
        };

        // Perbarui informasi suku cadang berdasarkan UUID
        const success = await Sparepart.update(uuid, updateSparepart);

        if (!success) {
            return res.status(500).json({ code: 500, status: 'error', message: 'Failed to update sparepart' });
        }

        if (Array.isArray(motor_type) && motor_type.length > 0) {

            // Hapus semua jenis motor yang mendukung suku cadang ini
            const deleteSparepartDetail = await SparepartDetail.deleteBySparepart(uuid);

            if (!deleteSparepartDetail) {
                return res.status(500).json({ code: 500, status: 'error', message: 'Failed to delete sparepart detail' });
            }

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

        res.json({ code: 200, status: 'success', message: 'Sparepart updated successfully' });
    } catch (error) {
        console.error('Error editing sparepart:', error);
        res.status(500).json({ code: 500, status: 'error', message: 'Internal Server Error' });
    }
};

// Controller untuk menghapus suku cadang
exports.deleteSparepart = async (req, res) => {
    try {
        const { uuid } = req.params;

        const deleteSparepartDetail = await SparepartDetail.deleteBySparepart(uuid);

        if (!deleteSparepartDetail) {
            return res.status(500).json({ code: 500, status: 'error', message: 'Failed to delete sparepart detail' });
        }

        // Hapus suku cadang berdasarkan UUID
        const success = await Sparepart.delete(uuid);

        if (!success) {
            return res.status(500).json({ code: 500, status: 'error', message: 'Failed to delete sparepart' });
        }

        res.json({ code: 200, status: 'success', message: 'Sparepart deleted successfully' });
    } catch (error) {
        console.error('Error deleting sparepart:', error);
        res.status(500).json({ code: 500, status: 'error', message: 'Internal Server Error' });
    }
};
