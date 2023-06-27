const { UserRole } = require('../models')

exports.addUserRole = async (req, res) => {
    try {
        const addUserRole = await UserRole.create(req.body)
        if (!addUserRole) {
            return res.json({ message: error.message })
        }
        return res.json({ message: 'UserRole added successfully !!!' })
    } catch (error) {
        return res.json({ message: error.message })
    }
}