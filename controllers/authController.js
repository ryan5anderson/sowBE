const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

// @desc Login
// @route POST /auth
// @access Public
const login = asyncHandler(async (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    console.log(`Login attempt for username: "${username}"`)
    console.log(`Current database: ${require('mongoose').connection.name}`)
    console.log(`Current collection: ${User.collection.name}`)
    
    // Try case-insensitive search
    const foundUser = await User.findOne({ 
        username: { $regex: new RegExp(`^${username}$`, 'i') } 
    }).exec()
    
    // Also try to find all users for debugging
    const allUsers = await User.find({}).select('username active').exec()
    console.log(`All users in database:`, allUsers.map(u => ({ username: u.username, active: u.active })))
    console.log(`Total users found: ${allUsers.length}`)

    if (!foundUser) {
        console.log(`❌ User not found: "${username}"`)
        console.log(`Available usernames:`, allUsers.map(u => u.username))
        return res.status(401).json({ message: 'Unauthorized - User not found' })
    }

    console.log(`✓ User found: ${foundUser.username}, active: ${foundUser.active}`)
    console.log(`Stored password hash starts with: ${foundUser.password.substring(0, 10)}...`)

    if (!foundUser.active) {
        console.log(`❌ User account is inactive: ${username}`)
        return res.status(401).json({ message: 'Unauthorized - User account is inactive' })
    }

    // Check if password is already hashed (starts with $2b$)
    let match = false
    if (foundUser.password.startsWith('$2b$') || foundUser.password.startsWith('$2a$')) {
        // Password is hashed, use bcrypt.compare
        match = await bcrypt.compare(password, foundUser.password)
        console.log(`Password match (bcrypt): ${match}`)
    } else {
        // Password is plaintext (shouldn't happen, but handle it)
        console.log(`⚠️ WARNING: Password stored as plaintext! This is insecure.`)
        match = password === foundUser.password
        console.log(`Password match (plaintext): ${match}`)
    }

    if (!match) {
        console.log(`❌ Invalid password for user: ${username}`)
        return res.status(401).json({ message: 'Unauthorized - Invalid password' })
    }

    console.log(`✓ Login successful for user: ${username}`)

    const accessToken = jwt.sign(
        {
            "UserInfo": {
                "username": foundUser.username,
                "roles": foundUser.roles
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' } 
    )

    const refreshToken = jwt.sign(
        { "username": foundUser.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    )

    // Create secure cookie with refresh token 
    res.cookie('jwt', refreshToken, {
        httpOnly: true, //accessible only by web server 
        secure: true, //https
        sameSite: 'None', //cross-site cookie 
        maxAge: 7 * 24 * 60 * 60 * 1000 //cookie expiry: set to match rT
    })

    // Send accessToken containing username and roles 
    res.json({ accessToken })
})

// @desc Refresh
// @route GET /auth/refresh
// @access Public - because access token has expired
const refresh = (req, res) => {
    const cookies = req.cookies

    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' })

    const refreshToken = cookies.jwt

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        asyncHandler(async (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })

            const foundUser = await User.findOne({ username: decoded.username }).exec()

            if (!foundUser) return res.status(401).json({ message: 'Unauthorized' })

            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": foundUser.username,
                        "roles": foundUser.roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' }
            )

            res.json({ accessToken })
        })
    )
}

// @desc Logout
// @route POST /auth/logout
// @access Public - just to clear cookie if exists
const logout = (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204) //No content
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    res.json({ message: 'Cookie cleared' })
}

module.exports = {
    login,
    refresh,
    logout
}