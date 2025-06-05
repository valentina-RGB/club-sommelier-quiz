
const {Admin} = require('../models/admin.model');

class AdminRepository {
    async getById(id) {
        return await Admin.findByPk(id)
    }

    // async create(data) {
    //     return await Admin.create(data);
    // }

    async findByEmail(email) {
        return await Admin.findOne({
            where: { email }
        });
    }
}

module.exports = AdminRepository;