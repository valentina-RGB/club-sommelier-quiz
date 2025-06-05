
const express = require('express');
const AdminController = require('../controllers/admin.controller');
const router = express.Router();
const { validateAdmin } = require('../middlewares/admin.middleware');

const adminController = new AdminController();
const {authenticateJWT} = require('../middlewares/auth.middleware')

router
    .get('/:id', authenticateJWT, adminController.getAdminById)
    // .post('/', validateAdmin, adminController.createAdmin)


module.exports = router;