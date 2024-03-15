const express = require('express');
const router = express.Router();
const professionalController = require('../Controllers/professionalUserController');

// Define the route handlers
router.post('/createProfessional', professionalController.create);
router.get('/getAllProfessional', professionalController.getAll);
router.get('/getByIdProfessional', professionalController.getById);
router.put('/updateProfessional', professionalController.update);
router.delete('/deleteProfessional', professionalController.delete);
router.post("/loginUser", professionalController.loginUser)
module.exports = router;
