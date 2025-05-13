const express = require('express');
const { createProject, getAllProjects, getProjectById, updateProject, deleteProject } = require('../controllers/projectController');
const { authentication, restrictTo } = require('../controllers/authController');

const router = express.Router();

router
    .route('/')
    .post(authentication, restrictTo('1'), createProject)
    .get(authentication, restrictTo('1'), getAllProjects);

router
    .route('/:id')
    .get(authentication, restrictTo('1'), getProjectById)
    .put(authentication, restrictTo('1'), updateProject)
    .delete(authentication, restrictTo('1'), deleteProject);

module.exports = router;