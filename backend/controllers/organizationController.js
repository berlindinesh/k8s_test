// import OrganizationNode from '../models/OrganizationNode.js';

// // Helper function to build the organization tree
// const buildOrganizationTree = async (rootNode) => {
//   if (!rootNode) return null;
  
//   const children = await OrganizationNode.find({ parentId: rootNode._id });
  
//   const node = rootNode.toObject();
  
//   if (children.length > 0) {
//     node.children = [];
//     for (const child of children) {
//       const childNode = await buildOrganizationTree(child);
//       node.children.push(childNode);
//     }
//   }
  
//   return node;
// };

// // Get the entire organization chart
// export const getOrganizationChart = async (req, res) => {
//   try {
//     // Find the root node (node with no parent)
//     const rootNode = await OrganizationNode.findOne({ parentId: null });
    
//     if (!rootNode) {
//       return res.status(200).json(null);
//     }
    
//     // Build the tree structure
//     const organizationTree = await buildOrganizationTree(rootNode);
    
//     res.status(200).json(organizationTree);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching organization chart', error: error.message });
//   }
// };

// // Add a new position
// export const addPosition = async (req, res) => {
//   try {
//     const { name, title, parentId, employeeId, email, department, status } = req.body;
    
//     // Create the new position
//     const newPosition = new OrganizationNode({
//       name,
//       title,
//       parentId: parentId || null,
//       employeeId,
//       email,
//       department,
//       status
//     });
    
//     await newPosition.save();
    
//     res.status(201).json(newPosition);
//   } catch (error) {
//     res.status(500).json({ message: 'Error adding position', error: error.message });
//   }
// };

// // Update a position
// export const updatePosition = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name, title, parentId, employeeId, email, department, status } = req.body;
    
//     // Check if this is the root node and parentId is being changed
//     const position = await OrganizationNode.findById(id);
//     if (!position) {
//       return res.status(404).json({ message: 'Position not found' });
//     }
    
//     // If this is the root node, don't allow changing the parentId
//     const isRoot = position.parentId === null;
    
//     const updatedPosition = await OrganizationNode.findByIdAndUpdate(
//       id,
//       {
//         name,
//         title,
//         parentId: isRoot ? null : (parentId || null),
//         employeeId,
//         email,
//         department,
//         status
//       },
//       { new: true }
//     );
    
//     if (!updatedPosition) {
//       return res.status(404).json({ message: 'Position not found' });
//     }
    
//     res.status(200).json(updatedPosition);
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating position', error: error.message });
//   }
// };

// // Delete a position
// export const deletePosition = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     // Check if this is the root node
//     const position = await OrganizationNode.findById(id);
//     if (!position) {
//       return res.status(404).json({ message: 'Position not found' });
//     }
    
//     if (position.parentId === null) {
//       return res.status(400).json({ message: 'Cannot delete the root position' });
//     }
    
//     // Check if this position has children
//     const hasChildren = await OrganizationNode.exists({ parentId: id });
//     if (hasChildren) {
//       return res.status(400).json({ 
//         message: 'Cannot delete a position with subordinates. Please reassign or delete subordinates first.' 
//       });
//     }
    
//     // Delete the position
//     await OrganizationNode.findByIdAndDelete(id);
    
//     res.status(200).json({ message: 'Position deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error deleting position', error: error.message });
//   }
// };

// // Get all positions (flat list)
// export const getAllPositions = async (req, res) => {
//   try {
//     const positions = await OrganizationNode.find().sort('name');
//     res.status(200).json(positions);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching positions', error: error.message });
//   }
// };

// // Get a single position
// export const getPosition = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const position = await OrganizationNode.findById(id);
    
//     if (!position) {
//       return res.status(404).json({ message: 'Position not found' });
//     }
    
//     res.status(200).json(position);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching position', error: error.message });
//   }
// };


import OrganizationNode, { organizationNodeSchema } from '../models/OrganizationNode.js';
import getModelForCompany from '../models/genericModelFactory.js';

// Helper function to build the organization tree
const buildOrganizationTree = async (rootNode, CompanyOrganizationNode) => {
  if (!rootNode) return null;
  
  const children = await CompanyOrganizationNode.find({ parentId: rootNode._id });
  
  const node = rootNode.toObject();
  
  if (children.length > 0) {
    node.children = [];
    for (const child of children) {
      const childNode = await buildOrganizationTree(child, CompanyOrganizationNode);
      node.children.push(childNode);
    }
  }
  
  return node;
};

// Get the entire organization chart
export const getOrganizationChart = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    console.log(`Fetching organization chart for company: ${companyCode}`);
    
    // Get company-specific OrganizationNode model
    const CompanyOrganizationNode = await getModelForCompany(companyCode, 'OrganizationNode', organizationNodeSchema);
    
    // Find the root node (node with no parent)
    const rootNode = await CompanyOrganizationNode.findOne({ parentId: null });
    
    if (!rootNode) {
      return res.status(200).json(null);
    }
    
    // Build the tree structure
    const organizationTree = await buildOrganizationTree(rootNode, CompanyOrganizationNode);
    
    console.log(`Retrieved organization chart for company ${companyCode}`);
    res.status(200).json(organizationTree);
  } catch (error) {
    console.error(`Error fetching organization chart for company ${req.companyCode}:`, error);
    res.status(500).json({ 
      error: 'Error fetching organization chart', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Add a new position
export const addPosition = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    console.log(`Adding position for company: ${companyCode}`);
    
    // Get company-specific OrganizationNode model
    const CompanyOrganizationNode = await getModelForCompany(companyCode, 'OrganizationNode', organizationNodeSchema);
    
    // Validate required fields
    const { name, title } = req.body;
    if (!name || !title) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Missing required fields: name and title are required'
      });
    }
    
    const { parentId, employeeId, email, department, status } = req.body;
    
    // Create the new position
    const newPosition = new CompanyOrganizationNode({
      name,
      title,
      parentId: parentId || null,
      employeeId,
      email,
      department,
      status
    });
    
    await newPosition.save();
    
    console.log(`Position added successfully: ${name}`);
    res.status(201).json(newPosition);
  } catch (error) {
    console.error('Error adding position:', error);
    
    // Handle specific MongoDB errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation error',
        message: error.message,
        details: Object.values(error.errors).map(err => err.message)
      });
    }
    
    if (error.name === 'MongoServerError' && error.code === 11000) {
      return res.status(409).json({
        error: 'Duplicate entry',
        message: 'A position with these details already exists'
      });
    }
    
    res.status(500).json({ 
      error: 'Error adding position', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Update a position
export const updatePosition = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ 
        error: 'Invalid request', 
        message: 'Position ID is required' 
      });
    }
    
    console.log(`Updating position ${id} for company: ${companyCode}`);
    
    // Get company-specific OrganizationNode model
    const CompanyOrganizationNode = await getModelForCompany(companyCode, 'OrganizationNode', organizationNodeSchema);
    
    // Check if this is the root node and parentId is being changed
    const position = await CompanyOrganizationNode.findById(id);
    if (!position) {
      return res.status(404).json({ message: 'Position not found' });
    }
    
    // If this is the root node, don't allow changing the parentId
    const isRoot = position.parentId === null;
    const { name, title, parentId, employeeId, email, department, status } = req.body;
    
    // Validate required fields
    if (!name || !title) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Missing required fields: name and title are required'
      });
    }
    
    const updatedPosition = await CompanyOrganizationNode.findByIdAndUpdate(
      id,
      {
        name,
        title,
        parentId: isRoot ? null : (parentId || null),
        employeeId,
        email,
        department,
        status
      },
      { 
        new: true,
        runValidators: true // This ensures validation runs on update
      }
    );
    
    if (!updatedPosition) {
      return res.status(404).json({ 
        error: 'Position not found',
        message: `No position found with ID: ${id}`
      });
    }
    
    console.log(`Position ${id} updated successfully`);
    res.status(200).json(updatedPosition);
  } catch (error) {
    console.error(`Error updating position ${req.params.id}:`, error);
    
    // Handle specific MongoDB errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation error',
        message: error.message,
        details: Object.values(error.errors).map(err => err.message)
      });
    }
    
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(400).json({
        error: 'Invalid ID',
        message: 'The provided position ID is not valid'
      });
    }
    
    res.status(500).json({ 
      error: 'Error updating position', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Delete a position
export const deletePosition = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ 
        error: 'Invalid request', 
        message: 'Position ID is required' 
      });
    }
    
    console.log(`Deleting position ${id} for company: ${companyCode}`);
    
    // Get company-specific OrganizationNode model
    const CompanyOrganizationNode = await getModelForCompany(companyCode, 'OrganizationNode', organizationNodeSchema);
    
    // Check if this is the root node
    const position = await CompanyOrganizationNode.findById(id);
    if (!position) {
      return res.status(404).json({ 
        error: 'Position not found',
        message: `No position found with ID: ${id}`
      });
    }
    
    if (position.parentId === null) {
      return res.status(400).json({ 
        error: 'Cannot delete root position',
        message: 'Cannot delete the root position'
      });
    }
    
    // Check if this position has children
    const hasChildren = await CompanyOrganizationNode.exists({ parentId: id });
    if (hasChildren) {
      return res.status(400).json({ 
        error: 'Position has subordinates',
        message: 'Cannot delete a position with subordinates. Please reassign or delete subordinates first.' 
      });
    }
    
    // Delete the position
    await CompanyOrganizationNode.findByIdAndDelete(id);
    
    console.log(`Position ${id} deleted successfully`);
    res.status(200).json({ message: 'Position deleted successfully' });
  } catch (error) {
    console.error(`Error deleting position ${req.params.id}:`, error);
    
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(400).json({
        error: 'Invalid ID',
        message: 'The provided position ID is not valid'
      });
    }
    
    res.status(500).json({ 
      error: 'Error deleting position', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Get all positions (flat list)
export const getAllPositions = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    console.log(`Fetching all positions for company: ${companyCode}`);
    
    // Get company-specific OrganizationNode model
    const CompanyOrganizationNode = await getModelForCompany(companyCode, 'OrganizationNode', organizationNodeSchema);
    
    // Get all positions from company database
    const positions = await CompanyOrganizationNode.find().sort('name');
    
    console.log(`Retrieved ${positions.length} positions for company ${companyCode}`);
    res.status(200).json(positions);
  } catch (error) {
    console.error(`Error fetching positions for company ${req.companyCode}:`, error);
    res.status(500).json({ 
      error: 'Error fetching positions', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Get a single position
export const getPosition = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ 
        error: 'Invalid request', 
        message: 'Position ID is required' 
      });
    }
    
    console.log(`Fetching position ${id} for company: ${companyCode}`);
    
    // Get company-specific OrganizationNode model
    const CompanyOrganizationNode = await getModelForCompany(companyCode, 'OrganizationNode', organizationNodeSchema);
    
    // Get position from company database
    const position = await CompanyOrganizationNode.findById(id);
    
    if (!position) {
      return res.status(404).json({ 
        error: 'Position not found',
        message: `No position found with ID: ${id}`
      });
    }
    
    console.log(`Retrieved position ${id} for company ${companyCode}`);
    res.status(200).json(position);
  } catch (error) {
    console.error(`Error fetching position ${req.params.id} for company ${req.companyCode}:`, error);
    
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(400).json({
        error: 'Invalid ID',
        message: 'The provided position ID is not valid'
      });
    }
    
    res.status(500).json({ 
      error: 'Error fetching position', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};
