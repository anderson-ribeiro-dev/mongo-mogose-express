const express = require('express')
const authMiddleware = require('../middlewares/auth')
const router = express.Router()

const Project = require('../models/project')
const Task = require('../models/task')

router.use(authMiddleware)

router.get('/', async (req, res) => {
    try {
        const projects = await Project.find().populate(['user', 'tasks']) //populate user, inner join populate('user')
        return res.send({ projects })
    } catch (error) {
        return res.status(400).send({ error: 'Error loading projects' })
    }
});

router.get('/:projectId', async (req, res) => {
   try {
       const project = await Project.findById(req.params.projectId).populate(['user','tasks'])
       return res.send({ project })
   } catch (error) {
    return res.status(400).send({ error: 'Error loading project' })
   }
})

router.post('/', async (req, res) => {
    try {
        const { title, description, tasks } = req.body
        const project = await Project.create({ title, description, user: req.userId })

        await Promise.all(tasks.map(async task => {
            const projectTask = new Task({ ...task, project: project._id })

            await projectTask.save()
            project.tasks.push(projectTask)
        }))

        await project.save()

        return res.send({ project })
    } catch (err) {
        return res.status(400).send({ error: 'Error creating new project' })
    }
})

router.put('/:projectId', async (req, res) => {
    try {
        const { title, description, tasks } = req.body
        const project = await Project.findByIdAndUpdate(req.params.projectId, {
             title, 
             description, 
        }, { new:  true }) //new true, projeto atualizado

        //remove as tasks existentes, para mandar as novas
        project.tasks = []
        await Task.deleteMany({ project: project._id })

        await Promise.all(tasks.map(async task => {
            const projectTask = new Task({ ...task, project: project._id })

            await projectTask.save()
            project.tasks.push(projectTask)
        }))

        await project.save()

        return res.send({ project })
    } catch (err) {
        console.log(err)
        return res.status(400).send({ error: 'Error updating new project' })
    }
})

router.delete('/:projectId', async (req, res) => {
    try {
        const project = await Project.findByIdAndRemove(req.params.projectId) //populate user, inner join
        return res.send({ project })
    } catch (error) {
        return res.status(400).send({ error: 'Error deleting project' })
    }
})

module.exports = app => app.use('/projects', router)