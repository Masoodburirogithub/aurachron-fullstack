// src/controllers/careerController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all positions
const getPositions = async (req, res) => {
  try {
    const positions = await prisma.careerPosition.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: positions });
  } catch (error) {
    console.error('Get positions error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Apply for position
const applyForPosition = async (req, res) => {
  try {
    const { fullName, email, position, portfolioLink, systemIdea, experience } = req.body;
    
    const application = await prisma.careerApplication.create({
      data: {
        fullName,
        email,
        position,
        portfolioLink: portfolioLink || null,
        systemIdea,
        experience: experience ? parseInt(experience) : null,
        status: 'pending'
      }
    });
    
    const io = req.app.get('io');
    if (io) io.emit('new-application', application);
    
    res.status(201).json({ 
      success: true, 
      data: application, 
      message: 'Application submitted successfully' 
    });
  } catch (error) {
    console.error('Apply error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create position (Admin)
const createPosition = async (req, res) => {
  try {
    const { title, department, location, type, experience, description, requirements } = req.body;
    
    const position = await prisma.careerPosition.create({
      data: {
        title,
        department,
        location,
        type,
        experience,
        description,
        requirements: requirements || []
      }
    });
    
    res.status(201).json({ 
      success: true, 
      data: position, 
      message: 'Position created successfully' 
    });
  } catch (error) {
    console.error('Create position error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update position (Admin)
const updatePosition = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, department, location, type, experience, description, requirements, isActive } = req.body;
    
    const position = await prisma.careerPosition.update({
      where: { id },
      data: {
        title,
        department,
        location,
        type,
        experience,
        description,
        requirements,
        isActive
      }
    });
    
    res.json({ 
      success: true, 
      data: position, 
      message: 'Position updated successfully' 
    });
  } catch (error) {
    console.error('Update position error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete position (Admin)
const deletePosition = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.careerPosition.delete({ where: { id } });
    
    res.json({ 
      success: true, 
      message: 'Position deleted successfully' 
    });
  } catch (error) {
    console.error('Delete position error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getPositions,
  applyForPosition,
  createPosition,
  updatePosition,
  deletePosition
};