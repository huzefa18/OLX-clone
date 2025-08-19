const jwt = require('jsonwebtoken');
const User = require('../models/Users');
const { signAccessToken, signRefreshToken } = require('../utils/tokens');

const refreshCookieToken = {
  httpOnly: true,
  secure: false,             
  sameSite: 'lax',       
  path: '/api/auth/refresh',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
        console.log(name,email,password)
    const flag = await User.findOne({ email });           
    if (flag) return res.status(409).json({
      status: 'fail',
      msg: 'email alr exists',
    });                                                   
    const user = await User.create({ name, email, password });
    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    return res
      .status(201)
      .cookie('jid', refreshToken, refreshCookieToken)
      .json({
        status: 'success',                                
        data: {
          name: user.name,
          id: user._id,                                    
          email: user.email,
        },
        accessToken,
      });
  } catch (err) {
    return res.status(500).json({ status: 'error', msg: 'server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email,password)
    const user = await User.findOne({ email }).select("+password");; 
    if (!user) return res.status(401).json({
      status: 'fail',
      msg: 'user not found',
    });                                                          

    const flag = await user.comparePassword(password);               
    if (!flag) return res.status(401).json({
      status: 'fail',
      msg: 'invalid password',
    });                                                             

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    return res
      .status(200)
      .cookie('jid', refreshToken, refreshCookieToken)
      .json({
        status: 'success',
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        accessToken,
      });
  } catch (err) {
    return res.status(500).json({ status: 'error', msg: 'server error' });
  }
};

exports.refresh = async (req, res) => {
  try {
    const token = req.cookies?.jid;                       
    if (!token) return res.status(401).json({
      status: 'fail',
      msg: 'refresh token not found',
    });

    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(payload.sub);        
    if (!user) return res.status(401).json({ status: 'fail', msg: 'User not found' });

    const newAccessToken = signAccessToken(user);
    const newRefreshToken = signRefreshToken(user);

    return res
      .status(200)
      .cookie('jid', newRefreshToken, refreshCookieToken) 
      .json({
        status: 'success',
        data: {
          id: user._id,                                 
          name: user.name,
          email: user.email,
        },
        accessToken: newAccessToken,                      
      });
  } catch (err) {
    return res.status(401).json({ status: 'fail', msg: 'Invalid refresh token' });
  }
};

exports.profile = async (req, res) => {
  const user = await User.findById(req.user.id).select('_id name email ');
  if (!user) return res.status(404).json({ status: 'fail', msg: 'User not found' });
  return res.json({ status: 'success', data: user });
};

exports.logout = async (req, res) => {
  return res.clearCookie('jid', { path: '/api/auth/refresh' }).json({ status: 'success' });
};
