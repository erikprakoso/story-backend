const Sales = require('../models/sales');
const SalesDetail = require('../models/salesDetail');
const { query } = require('../models/db');

exports.addSales = async (req, res) => {
    try {
        const sales = req.body;
        const {
            date,
            uuid_user,
            customer_name,
            customer_phone_number,
            sales_type,
            total_price,
            discount,
            final_price,
            is_paid,
            data_sparepart
        } = sales;

        if (!date) {
            return res.status(400).send({ code: 400, status: 'error', message: 'Date is required' });
        }

        if (!uuid_user) {
            return res.status(400).send({ code: 400, status: 'error', message: 'User is required' });
        }

        if (!customer_name) {
            return res.status(400).send({ code: 400, status: 'error', message: 'Customer name is required' });
        }

        if (!customer_phone_number) {
            return res.status(400).send({ code: 400, status: 'error', message: 'Customer phone number is required' });
        }

        if (!sales_type) {
            return res.status(400).send({ code: 400, status: 'error', message: 'Sales type is required' });
        }

        if (!total_price) {
            return res.status(400).send({ code: 400, status: 'error', message: 'Total price is required' });
        }

        if (!discount) {
            return res.status(400).send({ code: 400, status: 'error', message: 'Discount is required' });
        }

        if (!final_price) {
            return res.status(400).send({ code: 400, status: 'error', message: 'Final price is required' });
        }

        if (!is_paid) {
            return res.status(400).send({ code: 400, status: 'error', message: 'Is paid is required' });
        }

        if (Array.isArray(data_sparepart)) {
            if (data_sparepart.length === 0) {
                return res.status(400).send({ code: 400, status: 'error', message: 'Data sparepart is required' });
            }
        }

        const data = {
            date,
            uuid_user,
            customer_name,
            customer_phone_number,
            sales_type,
            total_price,
            discount,
            final_price,
            is_paid
        };

        const uuid = await Sales.create(data);

        if (!uuid) {
            return res.status(500).send({ code: 500, status: 'error', message: 'Internal server error' });
        }

        // Insert sales detail
        const promises = data_sparepart.map(sparepart => {
            const { uuid_sparepart, quantity, price } = sparepart;

            if (!uuid_sparepart) {
                return res.status(400).send({ code: 400, status: 'error', message: 'UUID sparepart is required' });
            }

            if (!quantity) {
                return res.status(400).send({ code: 400, status: 'error', message: 'Quantity is required' });
            }

            if (!price) {
                return res.status(400).send({ code: 400, status: 'error', message: 'Price is required' });
            }

            const detail = {
                uuid_sales: uuid,
                uuid_sparepart: sparepart.uuid_sparepart,
                quantity: sparepart.quantity,
                price: sparepart.price
            };

            return SalesDetail.create(detail);
        });

        await Promise.all(promises);

        return res.status(201).send({ code: 201, status: 'success', message: 'Sales has been created' });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ code: 500, status: 'error', message: 'Internal server error' });
    }
}

exports.editSales = async (req, res) => {
    try {
        const { uuid } = req.params;
        const sales = req.body;
        const {
            date,
            uuid_user,
            customer_name,
            customer_phone_number,
            sales_type,
            total_price,
            discount,
            final_price,
            is_paid,
            data_sparepart
        } = sales;

        if (!date) {
            return res.status(400).send({ code: 400, status: 'error', message: 'Date is required' });
        }

        if (!uuid_user) {
            return res.status(400).send({ code: 400, status: 'error', message: 'User is required' });
        }

        if (!customer_name) {
            return res.status(400).send({ code: 400, status: 'error', message: 'Customer name is required' });
        }

        if (!customer_phone_number) {
            return res.status(400).send({ code: 400, status: 'error', message: 'Customer phone number is required' });
        }

        if (!sales_type) {
            return res.status(400).send({ code: 400, status: 'error', message: 'Sales type is required' });
        }

        if (!total_price) {
            return res.status(400).send({ code: 400, status: 'error', message: 'Total price is required' });
        }

        if (!discount) {
            return res.status(400).send({ code: 400, status: 'error', message: 'Discount is required' });
        }

        if (!final_price) {
            return res.status(400).send({ code: 400, status: 'error', message: 'Final price is required' });
        }

        if (!is_paid) {
            return res.status(400).send({ code: 400, status: 'error', message: 'Is paid is required' });
        }

        if (Array.isArray(data_sparepart) && data_sparepart.length > 0) {
            for (const sparepart of data_sparepart) {
                if (!sparepart.uuid_sparepart) {
                    return res.status(400).send({ code: 400, status: 'error', message: 'UUID sparepart is required' });
                }

                if (!sparepart.quantity) {
                    return res.status(400).send({ code: 400, status: 'error', message: 'Quantity is required' });
                }

                if (!sparepart.price) {
                    return res.status(400).send({ code: 400, status: 'error', message: 'Price is required' });
                }
            }
        }

        const data = {
            date,
            uuid_user,
            customer_name,
            customer_phone_number,
            sales_type,
            total_price,
            discount,
            final_price,
            is_paid
        };

        const updated = await Sales.update(uuid, data);

        if (!updated) {
            return res.status(500).send({ code: 500, status: 'error', message: 'Internal server error' });
        }

        // Delete all sales detail by sales UUID
        await SalesDetail.deleteBySales(uuid);

        // Insert new sales detail
        const promises = data_sparepart.map(sparepart => {
            return SalesDetail.create({
                uuid_sales: uuid,
                uuid_sparepart: sparepart.uuid_sparepart,
                quantity: sparepart.quantity,
                price: sparepart.price
            });
        });

        await Promise.all(promises);

        return res.status(200).send({ code: 200, status: 'success', message: 'Sales has been updated' });

    } catch (error) {
        console.error(error);
        return res.status(500).send({ code: 500, status: 'error', message: 'Internal server error' });
    }
};

exports.deleteSales = async (req, res) => {
    try {
        const { uuid } = req.params;
        
        // Menghapus detail sales terlebih dahulu
        const detailDeleted = await SalesDetail.deleteBySales(uuid);

        if (!detailDeleted) {
            return res.status(500).send({ code: 500, status: 'error', message: 'Internal server error' });
        }

        // Menghapus sales
        const deleted = await Sales.delete(uuid);

        if (!deleted) {
            return res.status(500).send({ code: 500, status: 'error', message: 'Internal server error' });
        }

        return res.status(200).send({ code: 200, status: 'success', message: 'Sales has been deleted' });

    } catch (error) {
        console.error(error);
        return res.status(500).send({ code: 500, status: 'error', message: 'Internal server error' });
    }
}

exports.getAllSales = async (req, res) => {
    try {
        const { page, limit, search, month, year, day } = req.query;

        let conditions = [];

        // Membuat array untuk menyimpan kondisi-kondisi SQL
        let sqlConditions = [];

        // Jika parameter search diisi
        if (search) {
            sqlConditions.push(`customer_name LIKE '%${search}%'`);
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

        // Menghitung jumlah data sales
        const countQuery = `SELECT COUNT(*) AS total FROM sales ${conditions.join(' ')}`;
        const totalCountResult = await query(countQuery);
        const totalCount = totalCountResult[0].total;

        // Menyiapkan query untuk mengambil data restock dengan pagination
        const offset = (page - 1) * limit;
        const restockQuery = `SELECT * FROM sales ${conditions.join(' ')} ORDER BY date DESC LIMIT ${limit} OFFSET ${offset}`;
        const sales = await query(restockQuery);

        // Menggunakan Promise.all untuk menunggu hasil dari setiap operasi async
        await Promise.all(sales.map(async sale => {
            const details = await SalesDetail.getDetailsBySalesWithSparepart(sale.uuid);

            if (details.length > 0) {
                sale.details = details;
            }
        }
        ));

        res.json({
            code: 200, status: 'success', data: sales,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                totalItems: totalCount,
                totalPages: Math.ceil(totalCount / limit)
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ code: 500, status: 'error', message: 'Internal server error' });
    }
}

exports.getSalesById = async (req, res) => {
    try {
        const { uuid } = req.params;
        const sales = await Sales.getById(uuid);

        console.log(sales);

        if (!sales) {
            return res.status(404).send({ code: 404, status: 'error', message: 'Sales not found' });
        }

        const details = await SalesDetail.getDetailsBySalesWithSparepart(uuid);

        console.log(details);

        if (details.length > 0) {
            sales.details = details;
        }

        return res.status(200).send({ code: 200, status: 'success', data: sales });

    } catch (error) {
        console.error(error);
        return res.status(500).send({ code: 500, status: 'error', message: 'Internal server error' });
    }
}

exports.updateIsPaid = async (req, res) => {
    try {
        const { uuid } = req.params;
        const { is_paid } = req.body;

        if (is_paid === undefined) {
            return res.status(400).send({ code: 400, status: 'error', message: 'Is paid is required' });
        }

        const updated = await Sales.updateIsPaid(uuid, is_paid);

        if (!updated) {
            return res.status(500).send({ code: 500, status: 'error', message: 'Internal server error' });
        }

        return res.status(200).send({ code: 200, status: 'success', message: 'Is paid status has been updated' });

    } catch (error) {
        console.error(error);
        return res.status(500).send({ code: 500, status: 'error', message: 'Internal server error' });
    }
}