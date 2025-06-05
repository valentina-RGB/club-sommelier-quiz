const { Category } = require('../models/categories.model');

class CategoryRepository {
    async getAll() {
        return await Category.findAll();
    }

    async getById(id) {
        return await Category.findByPk(id)
    }
    
    async findByName(name) {
        return await Category.findOne({ where: { name } });
    }

    async create(data) {
        return await Category.create(data);
    }

    async update(id, data) {
        return await Category.update(data, { where: { id } });
    }

    async delete(id) {
        return await Category.destroy({ where: { id } });
    }
}

module.exports = CategoryRepository;
