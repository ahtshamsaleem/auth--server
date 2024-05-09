const User = require('../models/user');

exports.getUserData = async (req, res, next) => {
    const { id } = req.params;

    try {

        const user = await User.findById(id);
        if(!user) {
            throw new Error('No User Found')
        }

        res.status(200).json({
            name: user.name,
            email: user.email,
            verified: user.verified,
        });
    } catch (error) {
        next(error);
    }
};
