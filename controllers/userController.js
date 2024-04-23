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

    res.status(201).json({ message: 'User added successfully', uuid });
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
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
      res.json({ message: 'User updated successfully' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error editing user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Controller untuk menghapus pengguna
exports.deleteUser = async (req, res) => {
  try {
    const { uuid } = req.params;

    // Hapus pengguna berdasarkan UUID
    const success = await User.delete(uuid);

    if (success) {
      res.json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Controller untuk mendapatkan daftar semua pengguna
exports.getAllUsers = async (req, res) => {
  try {
    // Ambil semua pengguna dari database
    const users = await User.getAll();

    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};