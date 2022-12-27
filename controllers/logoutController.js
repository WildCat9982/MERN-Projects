const User = require('../model/User');


const handleLogout = async (req, res) => {
    // On client, also delete the accessToken

    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); // no content
    const refreshToken = cookies.jwt;

    // Is refreshToken in db?
    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None' })
        return res.sendStatus(403); // forbidden
    }

    // Delete refreshToken in db
    foundUser.refreshToken = '';
    const result = await foundUser.save();
    console.log(result)

    // res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true});  // secure: true - only serves on https
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None'});  // secure: true - only serves on https
    res.sendStatus(204); // no Content
}

module.exports = { handleLogout };
