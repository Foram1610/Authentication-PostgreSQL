const { Users, UserRole, sequelize } = require('../models')
// const transport = require('../config/sendmail')
const bcrypt = require('bcryptjs')
const { Op } = require('Sequelize');
// const userRoles = require('../config/ConstantData.json')
// const ejs = require('ejs')

exports.addUser = async (req, res) => {
    try {
        const userData = { ...req.body };
        let avatar = 'def.png'
        const user = await Users.findOne({ where: { email: userData.email } })
        if (user) {
            return res.status(409).json({ message: 'User already exits!!' });
        }
        if (req.file !== undefined) {
            avatar = req.file.filename
        }
        userData['avatar'] = avatar
        const user1 = await Users.create(userData)
        if (!user1) {
            return res.status(400).json({ data: `User's Data is not inserted!!` })
        }
        return res.status(200).json({ message: `User's Data inserted` })

        // const token = jwt.sign({
        //     username: email,
        // }, process.env.SECRET_KEY, { expiresIn: '5h' });
        // await User.update(
        //     {
        //         resetPasswordToken: token,
        //         expireToken: new Date().getTime() + 300 * 1000
        //     },
        //     { where: { email: email } })
        // const templateData = {
        //     firstName: firstName,
        //     middleName: middleName,
        //     lastName: lastName,
        //     email: email,
        //     url: process.env.EMAIL,
        //     token: token
        // }
        // const template = await ejs.renderFile("/Users/c100-89/Desktop/Foram/Narola_Support_Task/views/setPassword.ejs", templateData);

        // const mailOptions = {

        //     from: 'no-reply<fparmar986@gmail.com>',
        //     to: email,
        //     subject: 'Set Your Password',
        //     html: template
        // }
        // transport.sendMail(mailOptions)
        // if (!transport) {
        //     return res.status(404).json({ message: 'Somthing went wrong!!Can not sent mail to your email!!' })
        // }
        // else {
        //     return res.status(200).json({ message: `User's Data inserted!! Invitation sent to user's email!!!`, data: 2 })
        // }

    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

exports.updateUser = async (req, res) => {
    try {
        const updateUser = { ...req.body }
        const oldData = await Users.findOne({ where: { id: req.params.id } })
        const checkEmail = await Users.find({ where: { email: updateUser.email, id: { [Op.ne]: req.params.id } } })
        let avatar = oldData.avatar
        if (checkEmail) {
            return res.status(400).json({ message: `User already exist with this email!!` })
        }
        if (!oldData) {
            return res.status(400).json({ message: `User does not exist!!` })
        }
        if (req.file !== undefined) {
            avatar = req.file.filename
        }
        updateUser['avatar'] = avatar
        if (oldData.email === updateUser.email) {
            delete updateUser['email']
        }
        else {
            const user1 = await Users.update(updateUser)
            if (!user1) {
                return res.status(400).json({ message: `User's Data is not updated!!` })
            }
            return res.status(200).json({ message: `User's Data updated!!` })
        }
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const oldData = await Users.findOne({ where: { id: req.params.id } })
        if (!oldData) {
            return res.status(400).json({ message: `User does not exist!!` })
        }
        else {
            const user = await Users.update({
                isDeleted: true,
                isActive: false
            }, { where: { id: req.params.id } })
            if (!user) {
                return res.status(400).json({ message: `User's Data is not deleted!!` })
            }
            return res.status(200).json({ message: `User's Data deleted!!` })
        }
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

exports.userStatusChange = async (req, res) => {
    try {
        const oldData = await Users.findOne({ where: { id: req.params.id } })
        let filter = { isActive: true }
        if (!oldData) {
            return res.status(400).json({ message: `User does not exist!!` })
        }
        else {
            if (oldData.isActive === true) {
                filter = {
                    isActive: false
                }
            }
            const user = await Users.update(filter, { where: { id: req.params.id } })
            if (!user) {
                return res.status(400).json({ message: 'somthing went wrong!!' })
            }
            return res.status(200).json({ message: `User's status changed!!` })
        }
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

exports.resetPassword = async (req, res) => {
    try {
        const { currpassword, password } = req.body
        const oldPassword = await Users.findOne({ where: { id: req.logInid } })
        const isMatch = await bcrypt.compare(currpassword, oldPassword.password)
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is invalid!!' });
        }
        
        const passswordStatus = await Users.update({ password: password }, { where: { id: req.logInid } })
        if (!passswordStatus) {
            return res.status(400).json({ message: 'Somthing went wrong!!' })
        }
        return res.status(200).json({ message: 'Password changed!!' })
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

exports.getUserById = async (req, res) => {
    try {
        const user = await Users.findOne({
            where: { id: req.params.id },
            attributes: { exclude: ['createdAt', 'updatedAt', 'password', 'resetPasswordToken', 'expireToken'] },
            include: [
                {
                    model: UserRole,
                    attributes: ['role', 'isActive']
                }
            ],
        })
        if (!user) {
            return res.status(400).json({ message: 'User not exist!!!!' })
        }
        return res.status(200).json({ data: user })
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

exports.displayUsers = async (req, res) => {
    try {
        const option = { ...req.body };
        if (!option.hasOwnProperty('query')) {
            option['query'] = {};
        }
        option.query['addedBy'] = { $ne: null }

        const users = await paginate(option, Users);
        return res.status(200).json(users);
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}