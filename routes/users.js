var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var User = require('../models/userModel');
require('dotenv').config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

let refreshTokens = [];

//Đăng nhập
router.post('/login', async function (req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Vui lòng nhập email và mật khẩu" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Email không tồn tại" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Mật khẩu không đúng" })
    }

    //tạo access token
    const accessToken = jwt.sign({ id: user._id, email: user.email },
      ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );

    //tạo refresh token
    const refreshToken = jwt.sign({ id: user._id, email: user.email },
      REFRESH_TOKEN_SECRET,
      { expiresIn: '30d' }
    );
    //lưu refresh vào list
    refreshTokens.push(refreshToken);

    res.json({
      message: "Đăng nhập thành công",
      accessToken,
      refreshToken,
      user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server!!!' });
  }
});

//api để refresh token
router.post('/refresh-token', (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken || !refreshTokens.includes(refreshToken)) {
    return res.status(403).json({ message: "Refresh token không hợp lệ" });
  }

  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (error, user) => {
    if (error) return res.status(403).json({ message: 'Refresh token hết hạn' });

    //tạo token mới 
    const accessToken = jwt.sign({ id: user._id, email: user.email },
      ACCESS_TOKEN_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ accessToken });
  });
});

//đăng xuất
router.post('/logout', (req, res) => {
  const { refreshToken } = req.body;
  refreshToken = refreshTokens.filter(token => token != refreshToken);
  res.json({ message: "Đăng xuất thành công" });
});

//đăng ký
router.post('/register', async function (req, res) {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: "Vui lòng nhập đủ thông tin" });
    }

    //kieemt tra tồn tại email và phone
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      if (existingUser.email == email) {
        return res.status(400).json({ message: "Email đã được sử dụng" });
      }
      if (existingUser.phone == phone) {
        return res.status(400).json({ message: 'Số điện thoại đã được sử dụng' });
      }
    }

    //mã hóa mk
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone,
    });

    await newUser.save();

    res.status(201).json({
      message: 'Đăng ký thành công',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

//check email
router.post('/check-email', async (req, res) => {
  const { email } = req.body;
  const existingUser = await User.findOne({ email });
  res.json({ exists: !!existingUser });
});

module.exports = router;
