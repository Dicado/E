const jwt = require('jsonwebtoken');
const Manager = require('../models/Manager');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const manager = await Manager.findByEmail(email);

    if (!manager) {
      return res.status(404).json({ error: 'Менеджер не найден' });
    }

    const isMatch = await manager.isValidPassword(password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Неверный пароль' });
    }

    const token = jwt.sign({ id: manager.id }, process.env.JWT_SECRET, { expiresIn: '8h' });

    return res.status(200).json({ token });
  } catch (err) {
    console.error('[Login Error]', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};
