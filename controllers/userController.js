const bcrypt = require('bcrypt');
const User = require('../models/user');

// Controller untuk menambah pengguna baru
exports.addUser = async (req, res) => {
  try {
    const { username, password, name, rolename, phone_number } = req.body;

    // Hash password sebelum disimpan
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan pengguna ke database
    const uuid = await User.create(username, hashedPassword, name, rolename, phone_number);

    res.status(201).json({
      code: 201,
      status: 'success',
      message: 'User added successfully',
      uuid
    });
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({
      code: 500,
      status: 'error',
      message: error.sqlMessage
    });
  }
};

// Controller untuk mengedit informasi pengguna
exports.editUser = async (req, res) => {
  try {
    const { uuid } = req.params;
    const updates = req.body;

    // Perbarui informasi pengguna berdasarkan UUID
    const success = await User.update(uuid, updates);

    if (success) {
      res.json({
        code: 200,
        status: 'success',
        message: 'User updated successfully'
      });
    } else {
      res.status(404).json({
        code: 404,
        status: 'error',
        message: 'User not found'
      });
    }
  } catch (error) {
    console.error('Error editing user:', error);
    res.status(500).json({
      code: 500,
      status: 'error',
      message: error.sqlMessage
    });
  }
};

// Controller untuk menghapus pengguna
exports.deleteUser = async (req, res) => {
  try {
    const { uuid } = req.params;

    // Hapus pengguna berdasarkan UUID
    const success = await User.delete(uuid);

    if (success) {
      res.json({
        code: 200,
        status: 'success',
        message: 'User deleted successfully'
      });
    } else {
      res.status(404).json({
        code: 404,
        status: 'error',
        message: 'User not found'
      });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      code: 500,
      status: 'error',
      message: error.sqlMessage
    });
  }
};

// Controller untuk mendapatkan daftar semua pengguna
exports.getAllUsers = async (req, res) => {
  try {
    // Ambil semua pengguna dari database
    const users = await User.getAll();

    res.json({
      code: 200,
      status: 'success',
      message: 'Users retrieved successfully',
      data: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      code: 500,
      status: 'error',
      message: error.sqlMessage
    });
  }
};