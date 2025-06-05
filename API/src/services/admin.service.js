const bcrypt = require('bcrypt');
// const { StatusCodes } = require('http-status-codes');
const AdminRepository = require('../repositories/admin.repository');

class AdminService {
  constructor() {
     this.adminRepository = new AdminRepository();
  }

  // async createAdmin(data) {
  //   // Verificar si existe el admin
  //    const existingAdmin = await this.adminRepository.findByEmail(data.email);

  //   if (existingAdmin) {
  //     const error = new Error('Admin with this email already exists');
  //     error.status = StatusCodes.CONFLICT;
  //     throw error;
  //   }

  //   // Encriptar password y crear admin
  //   const hashedPassword = await bcrypt.hash(data.password, 10);
  //   const adminData = {
  //     ...data,
  //     password: hashedPassword
  //   };

  //   const newAdmin = await this.adminRepository.create(adminData);
    
  //   // Remover password del resultado
  //   const { password, ...adminWithoutPassword } = newAdmin.toJSON();
  //   return adminWithoutPassword;
  // }

  async getAdminById(id) {
    return await this.adminRepository.getById(id);
  }
}

module.exports = AdminService;