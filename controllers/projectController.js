const project = require("../db/models/project");
const user = require("../db/models/user");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const createProject = catchAsync(async (req, res, next) => {

    const {
        title,
        isFeatured,
        productImage,
        price,
        shortDescription,
        description,
        productUrl,
        category,
        tags,
    } = req.body;

    const userId = req.user.id;

    const newProject = await project.create({
        title,
        isFeatured,
        productImage,
        price,
        shortDescription,
        description,
        productUrl,
        category,
        tags,
        createdBy: userId, // Replace with req.user.id if using auth middleware
    });

    return res.status(201).json({
        status: "success",
        data: newProject,
    });
});

const getAllProjects = catchAsync(async (req, res, next) => {
    const userId = req.user.id;

    const projects = await project.findAll({
        include: {
            model: user,
            attributes: { exclude: [ 'password', 'createdAt', 'updatedAt'] }
        },
        where: {
            createdBy: userId
        }
    });

    return res.status(200).json({
        status: 'success',
        results: projects.length,
        data: projects
    });
});

const getProjectById = catchAsync(async (req, res, next) => {
    const projectId = req.params.id;

    const result = await project.findByPk(projectId, {
        include: {
            model: user,
            attributes: { exclude: [ 'password', 'createdAt', 'updatedAt'] } // exclude sensitive fields
        }
    });

    if (!result) {
        return next(new AppError('Project not found', 404));
    }

    return res.json({
        status: 'success',
        data: result
    });
});

const updateProject = catchAsync(async (req, res, next) => {
    const projectId = req.params.id;
    const userId = req.user.id; // assuming you're using authentication middleware
    const updates = req.body;

    // 1. Find the project by ID
    const existingProject = await project.findByPk(projectId);

    // 2. Check if project exists
    if (!existingProject) {
        return next(new AppError('Invalid project ID', 404));
    }

    // Optional: Check if the user is the owner of the project
    if (existingProject.createdBy !== userId) {
        return next(new AppError('You are not authorized to update this project', 403));
    }

    // 3. Update the project
    const updatedProject = await existingProject.update({
        title: updates.title,
        isFeatured: updates.isFeatured,
        productImage: updates.productImage,
        price: updates.price,
        shortDescription: updates.shortDescription,
        description: updates.description,
        productUrl: updates.productUrl,
        category: updates.category,
        tags: updates.tags
    });

    // 4. Respond with success
    return res.status(200).json({
        status: 'success',
        data: updatedProject
    });
});

const deleteProject = catchAsync(async (req, res, next) => {
    const projectId = req.params.id;
    const userId = req.user.id;

    // 1. Find the project by ID
    const existingProject = await project.findByPk(projectId);

    // 2. Check if project exists
    if (!existingProject) {
        return next(new AppError('Project not found', 404));
    }

    // 3. Optional: Check if the user is authorized to delete (ownership)
    if (existingProject.createdBy !== userId) {
        return next(new AppError('You are not authorized to delete this project', 403));
    }

    // 4. Delete the project
    await existingProject.destroy();

    return res.status(204).json(); // 204 No Content: successful but no body returned
});

module.exports = { createProject, getAllProjects, getProjectById, updateProject, deleteProject };