const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { ObjectId } = require('mongodb');

module.exports = function(db) {
  router.post('/', authMiddleware, async (req, res) => {
    try {
      const {projectName, projectDescription, projectDeadline} = req.body;
      if (!projectName || !projectDeadline) {
         return res.status(400).json({ message: 'Project name and deadline are required' });
      }
      const deadline = new Date(projectDeadline);
      if (isNaN(deadline.getTime())) {
        return res.status(400).json({ message: 'Invalid deadline format' });
      }
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (deadline < today) {
        return res.status(400).json({ message: 'Invalid deadline' });
      }
      
      const newProject = {
        createdBy: req.userId,
        projectName,
        projectDescription,
        deadline,
        createdAt: new Date(),
      }
      const result = await db.collection('projects').insertOne(newProject);
      res.status(201).json({ message: 'Project created successfully', projectId: result.insertedId, project:{
        _id: result.insertedId,
        ...newProject
      } });
    } catch (err) {
      console.error('Error creating project:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  router.get('/', authMiddleware, async (req, res) => {
    try {
      const projects = await db
        .collection('projects')
        .find({ createdBy: req.userId })
        .sort({ createdAt: -1 })
        .toArray();

      res.status(200).json({ projects });
      
    } catch (err) {
      console.error('Error fetching projects:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  router.put('/:id', authMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const { projectName, projectDescription, projectDeadline } = req.body;

      if (!ObjectId.isValid(id)) {
         return res.status(400).json({ message: 'Invalid project ID' });
      }
      if (!projectName || !projectDeadline) {
        return res.status(400).json({ message: 'Project name and deadline are required' });
      }

      const deadline = new Date(projectDeadline);
      if (isNaN(deadline.getTime())) {
         return res.status(400).json({ message: 'Invalid deadline format' });
      }
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (deadline < today) {
        return res.status(400).json({ message: 'Invalid deadline' })
      }

      const updatedProject = {
        projectName,
        projectDescription,
        deadline,
        updatedAt: new Date(),
      };

      const result = await db.collection('projects').updateOne(
        { _id: new ObjectId(id), createdBy: req.userId },
        { $set: updatedProject }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ message: 'Project not found or unauthorized' });
      }
      res.status(200).json({ 
        message: 'Project updated successfully',
        project: { _id: id,
        createdBy: req.userId,
        ...updatedProject}
      });
    } catch (err) {
      console.error('Error updating project:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  router.delete('/:id', authMiddleware, async (req, res) => {
    try {
      const { id } = req.params;

      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid project ID' });
      }
      const result = await db.collection('projects').deleteOne({
        _id: new ObjectId(id),
        createdBy: req.userId,
      });

      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'Project not found or unauthorized' });
      }

      res.status(200).json({ message: 'Project deleted successfully' })
    } catch (err) {
      console.error('Error deleting project:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  return router;
}