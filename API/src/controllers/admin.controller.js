const AdminService = require("../services/admin.service");
const { AdminResponseDto } = require("../dtos/admin.response.dto");


class AdminController {
  constructor() {
    this.adminService = new AdminService();
  }

    getAdminById = async (req, res, next) => {
    try {
      const admin = await this.adminService.getAdminById(req.params.id);
      
      if (!admin) {
        return res.status(404).json({ error: 'Admin not found' });
      }
      
      const formattedAdmin = new AdminResponseDto(admin);
      return res.status(200).json(formattedAdmin);  // Cambié 201 a 200
    } catch (error) {
      next(error); // Mejor manejo de errores
    }
  };


  // createAdmin = async (req, res, next) => {
  //   try {
  //     const admin = await this.adminService.createAdmin(req.body);
  //     const formattedAdmin = new AdminResponseDto(admin);
  //     res.status(201).json(formattedAdmin);

  //   } catch (error) {
  //       if (error.status === 409) {
  //           return res.status(409).json({ message: error.message });
  //       }
  //     res.status(500).json({ message: "Error creating admin", error });
  //   }
  // };
}

module.exports = AdminController;
