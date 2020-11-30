const {Router} = require('express')
const emailValidator = require('email-validator')
const {v4: uuid} = require('uuid')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const ms = require('ms')

const User = require('../models/User')
const RefreshToken = require('../models/RefreshToken')

const router = Router()

const signToken = userId => {
   return jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_TOKEN_LIFETIME})
}

const signRefreshToken = async userId => {
   const refreshToken = uuid()

   await RefreshToken.create({token: refreshToken, userId})

   return refreshToken
}

const signTokens = async userId => {
   return [await signToken(userId), await signRefreshToken(userId)]
}

router.post('/register', async (req, res) => {
   const {login, password} = req.body

   if (!(emailValidator && password)) {
      return res.status(400).json({message: 'Некорректные данные'})
   }

   const candidate = await User.findOne({login})

   if (candidate) {
      return res.status(400).json({message: 'Такой пользователь уже существует'})
   }

   const hashedPassword = await bcrypt.hash(password, 12)
   User.create({login, password: hashedPassword})

   res.status(201).json({message: 'Пользователь создан'})
})

router.post('/login', async (req, res) => {
   const {login, password} = req.body

   if (!(login && password)) {
      return res.status(400).json({message: 'Некорректные данные'})
   }

   const user = await User.findOne({login})

   if (!user) {
      return res.status(400).json({message: 'Логин или пароль введены неверно'})
   }

   const isMatch = await bcrypt.compare(password, user.password)

   if (!isMatch) {
      return res.status(400).json({message: 'Логин или пароль введены неверно'})
   }

   const [token, refreshToken] = await signTokens(user.id)

   res.cookie('refreshToken', refreshToken, {httpOnly: true, maxAge: ms(process.env.REFRESH_TOKEN_LIFETIME)})
      .json({token, message: 'Пользователь создан'})
})

router.get('/refresh', async (req, res) => {
   if (!req.cookies.refreshToken) {
      return res.status(401).json({message: 'Вы не авторизованы'})
   }

   const rToken = await RefreshToken.findOne({token: req.cookies.refreshToken})

   if (!rToken) {
      return res.clearCookie('refreshToken').json({message: 'Refresh token не существует'})
   }

   const user = await User.findOne({userId: rToken.userId})

   await RefreshToken.deleteOne({userId: user.id})

   const [token, refreshToken] = await signTokens(user.id)


   res.cookie('refreshToken', refreshToken, {httpOnly: true, maxAge: ms(process.env.REFRESH_TOKEN_LIFETIME)}).json({token})
})

module.exports = router