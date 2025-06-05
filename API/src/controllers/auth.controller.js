const AuthService = require('../services/auth.service');
const {AuthResponseDto} = require('../dtos/auth.response.dto');

class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await this.authService.login(email, password);
      res.status(200).json(new AuthResponseDto({ user }));
    } catch (error) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({ message: error.message });
      }
    }
  }

}

module.exports = AuthController;