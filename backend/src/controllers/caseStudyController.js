// backend/src/controllers/caseStudyController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all case studies
const getCaseStudies = async (req, res) => {
  try {
    const caseStudies = await prisma.caseStudy.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' }
    });
    
    res.json({
      success: true,
      data: caseStudies,
      count: caseStudies.length
    });
  } catch (error) {
    console.error('Get case studies error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get single case study
const getCaseStudyById = async (req, res) => {
  try {
    const { id } = req.params;
    const caseStudy = await prisma.caseStudy.findUnique({
      where: { id }
    });
    
    if (!caseStudy) {
      return res.status(404).json({ success: false, error: 'Case study not found' });
    }
    
    res.json({ success: true, data: caseStudy });
  } catch (error) {
    console.error('Get case study error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create case study - Store base64 image directly in database (PERMANENT)
const createCaseStudy = async (req, res) => {
  try {
    const { title, subtitle, industry, technology, challenge, solution, result, imageUrl, displayOrder } = req.body;
    
    // Validate required fields
    if (!title || !industry || !technology || !challenge || !solution || !result) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields' 
      });
    }
    
    // Store image as base64 directly in database - PERMANENT storage
    let savedImageUrl = null;
    if (imageUrl && imageUrl.startsWith('data:image')) {
      savedImageUrl = imageUrl;  // Base64 stored in Neon database - never disappears
    } else if (imageUrl && imageUrl.startsWith('http')) {
      savedImageUrl = imageUrl;
    } else if (imageUrl) {
      savedImageUrl = imageUrl;
    }
    
    const caseStudy = await prisma.caseStudy.create({
      data: {
        title,
        subtitle: subtitle || null,
        industry,
        technology,
        challenge,
        solution,
        result,
        imageUrl: savedImageUrl,
        displayOrder: displayOrder || 0,
        isActive: true
      }
    });
    
    res.status(201).json({
      success: true,
      data: caseStudy,
      message: 'Case study created successfully'
    });
  } catch (error) {
    console.error('Create case study error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update case study - Store base64 image directly in database (PERMANENT)
const updateCaseStudy = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subtitle, industry, technology, challenge, solution, result, imageUrl, displayOrder, isActive } = req.body;
    
    // Get existing case study
    const existingCaseStudy = await prisma.caseStudy.findUnique({ where: { id } });
    if (!existingCaseStudy) {
      return res.status(404).json({ success: false, error: 'Case study not found' });
    }
    
    let savedImageUrl = existingCaseStudy.imageUrl;
    
    // Handle new image - store base64 directly in database (PERMANENT)
    if (imageUrl && imageUrl.startsWith('data:image')) {
      savedImageUrl = imageUrl;  // Base64 stored in Neon database - never disappears
    } else if (imageUrl === '') {
      savedImageUrl = null;
    } else if (imageUrl && imageUrl.startsWith('http')) {
      savedImageUrl = imageUrl;
    } else if (imageUrl) {
      savedImageUrl = imageUrl;
    }
    
    const caseStudy = await prisma.caseStudy.update({
      where: { id },
      data: {
        title: title || existingCaseStudy.title,
        subtitle: subtitle !== undefined ? subtitle : existingCaseStudy.subtitle,
        industry: industry || existingCaseStudy.industry,
        technology: technology || existingCaseStudy.technology,
        challenge: challenge || existingCaseStudy.challenge,
        solution: solution || existingCaseStudy.solution,
        result: result || existingCaseStudy.result,
        imageUrl: savedImageUrl,
        displayOrder: displayOrder !== undefined ? displayOrder : existingCaseStudy.displayOrder,
        isActive: isActive !== undefined ? isActive : existingCaseStudy.isActive
      }
    });
    
    res.json({
      success: true,
      data: caseStudy,
      message: 'Case study updated successfully'
    });
  } catch (error) {
    console.error('Update case study error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete case study
const deleteCaseStudy = async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.caseStudy.delete({ where: { id } });
    
    res.json({ success: true, message: 'Case study deleted successfully' });
  } catch (error) {
    console.error('Delete case study error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getCaseStudies,
  getCaseStudyById,
  createCaseStudy,
  updateCaseStudy,
  deleteCaseStudy
};