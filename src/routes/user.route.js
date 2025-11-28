const express = require('express');
const app = express.Router();
const controller = require('../controllers/user.controller');

app.get('/', controller.getUsers);

app.get('/:id', controller.getUserById);

app.post('/', controller.createUser);

app.put('/:id', controller.updateUser);

app.delete('/:id', controller.deleteUser);

module.exports = app;