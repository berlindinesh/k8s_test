// // import SkillZone from '../models/SkillZone.js';

// // // Get all skills
// // export const getAllSkills = async (req, res) => {
// //   try {
// //     const skills = await SkillZone.find();
// //     res.status(200).json(skills);
// //   } catch (error) {
// //     res.status(500).json({ message: 'Error fetching skills', error });
// //   }
// // };

// // // Add a new skill
// // export const addSkill = async (req, res) => {
// //   const { name, candidates } = req.body;
// //   try {
// //     const newSkill = new SkillZone({ name, candidates });
// //     await newSkill.save();
// //     res.status(201).json(newSkill);
// //   } catch (error) {
// //     res.status(500).json({ message: 'Error adding skill', error });
// //   }
// // };

// // // Add a candidate to a skill
// // export const addCandidate = async (req, res) => {
// //   const { skillId } = req.params;
// //   const { name, reason, addedOn, employeeId, email, department, designation } = req.body;
  
// //   try {
// //     const skill = await SkillZone.findById(skillId);
// //     if (!skill) {
// //       return res.status(404).json({ message: 'Skill not found' });
// //     }
    
// //     // Create candidate object with all fields
// //     const candidateData = {
// //       name,
// //       reason,
// //       addedOn: addedOn || new Date().toLocaleDateString()
// //     };
    
// //     // Only add employee fields if they exist
// //     if (employeeId) candidateData.employeeId = employeeId;
// //     if (email) candidateData.email = email;
// //     if (department) candidateData.department = department;
// //     if (designation) candidateData.designation = designation;
    
// //     skill.candidates.push(candidateData);
    
// //     await skill.save();
// //     res.status(200).json(skill);
// //   } catch (error) {
// //     res.status(500).json({ message: 'Error adding candidate to skill', error });
// //   }
// // };

// // // Update a candidate in a skill
// // export const updateCandidate = async (req, res) => {
// //   const { skillId, candidateId } = req.params;
// //   const { name, reason, employeeId, email, department, designation } = req.body;
  
// //   try {
// //     const skill = await SkillZone.findById(skillId);
// //     if (!skill) {
// //       return res.status(404).json({ message: 'Skill not found' });
// //     }
    
// //     const candidateIndex = skill.candidates.findIndex(
// //       c => c._id.toString() === candidateId
// //     );
    
// //     if (candidateIndex === -1) {
// //       return res.status(404).json({ message: 'Candidate not found' });
// //     }
    
// //     // Update basic fields
// //     skill.candidates[candidateIndex].name = name;
// //     skill.candidates[candidateIndex].reason = reason;
    
// //     // Update employee fields if provided
// //     if (employeeId !== undefined) {
// //       skill.candidates[candidateIndex].employeeId = employeeId;
// //     }
    
// //     if (email !== undefined) {
// //       skill.candidates[candidateIndex].email = email;
// //     }
    
// //     if (department !== undefined) {
// //       skill.candidates[candidateIndex].department = department;
// //     }
    
// //     if (designation !== undefined) {
// //       skill.candidates[candidateIndex].designation = designation;
// //     }
    
// //     await skill.save();
// //     res.status(200).json(skill);
// //   } catch (error) {
// //     res.status(500).json({ message: 'Error updating candidate', error });
// //   }
// // };

// // // Delete a candidate from a skill
// // export const deleteCandidate = async (req, res) => {
// //   const { skillId, candidateId } = req.params;
  
// //   try {
// //     const skill = await SkillZone.findById(skillId);
// //     if (!skill) {
// //       return res.status(404).json({ message: 'Skill not found' });
// //     }
    
// //     skill.candidates = skill.candidates.filter(
// //       candidate => candidate._id.toString() !== candidateId
// //     );
    
// //     await skill.save();
// //     res.status(200).json({ message: 'Candidate deleted successfully', skill });
// //   } catch (error) {
// //     res.status(500).json({ message: 'Error deleting candidate', error });
// //   }
// // };

// // // Delete a skill
// // export const deleteSkill = async (req, res) => {
// //   const { skillId } = req.params;
  
// //   try {
// //     const deletedSkill = await SkillZone.findByIdAndDelete(skillId);
// //     if (!deletedSkill) {
// //       return res.status(404).json({ message: 'Skill not found' });
// //     }
    
// //     res.status(200).json({ message: 'Skill deleted successfully' });
// //   } catch (error) {
// //     res.status(500).json({ message: 'Error deleting skill', error });
// //   }
// // };

// import SkillZone, { skillZoneSchema } from '../models/SkillZone.js';
// import getModelForCompany from '../models/genericModelFactory.js';

// // Get all skills
// export const getAllSkills = async (req, res) => {
//   try {
//     // Get company code from authenticated user
//     const companyCode = req.companyCode;
    
//     // Get company-specific SkillZone model
//     const CompanySkillZone = await getModelForCompany(companyCode, 'SkillZone', skillZoneSchema);
    
//     // Get skills from company database
//     const skills = await CompanySkillZone.find();
//     res.status(200).json(skills);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching skills', error: error.message });
//   }
// };

// // Add a new skill
// export const addSkill = async (req, res) => {
//   const { name, candidates } = req.body;
//   try {
//     // Get company code from authenticated user
//     const companyCode = req.companyCode;
    
//     // Get company-specific SkillZone model
//     const CompanySkillZone = await getModelForCompany(companyCode, 'SkillZone', skillZoneSchema);
    
//     // Create new skill in company database
//     const newSkill = new CompanySkillZone({ name, candidates });
//     await newSkill.save();
//     res.status(201).json(newSkill);
//   } catch (error) {
//     res.status(500).json({ message: 'Error adding skill', error: error.message });
//   }
// };

// // Add a candidate to a skill
// export const addCandidate = async (req, res) => {
//   const { skillId } = req.params;
//   const { name, reason, addedOn, employeeId, email, department, designation } = req.body;
  
//   try {
//     // Get company code from authenticated user
//     const companyCode = req.companyCode;
    
//     // Get company-specific SkillZone model
//     const CompanySkillZone = await getModelForCompany(companyCode, 'SkillZone', skillZoneSchema);
    
//     // Find skill in company database
//     const skill = await CompanySkillZone.findById(skillId);
//     if (!skill) {
//       return res.status(404).json({ message: 'Skill not found' });
//     }
    
//     // Create candidate object with all fields
//     const candidateData = {
//       name,
//       reason,
//       addedOn: addedOn || new Date().toLocaleDateString()
//     };
    
//     // Only add employee fields if they exist
//     if (employeeId) candidateData.employeeId = employeeId;
//     if (email) candidateData.email = email;
//     if (department) candidateData.department = department;
//     if (designation) candidateData.designation = designation;
    
//     skill.candidates.push(candidateData);
    
//     await skill.save();
//     res.status(200).json(skill);
//   } catch (error) {
//     res.status(500).json({ message: 'Error adding candidate to skill', error: error.message });
//   }
// };

// // Update a candidate in a skill
// export const updateCandidate = async (req, res) => {
//   const { skillId, candidateId } = req.params;
//   const { name, reason, employeeId, email, department, designation } = req.body;
  
//   try {
//     // Get company code from authenticated user
//     const companyCode = req.companyCode;
    
//     // Get company-specific SkillZone model
//     const CompanySkillZone = await getModelForCompany(companyCode, 'SkillZone', skillZoneSchema);
    
//     // Find skill in company database
//     const skill = await CompanySkillZone.findById(skillId);
//     if (!skill) {
//       return res.status(404).json({ message: 'Skill not found' });
//     }
    
//     const candidateIndex = skill.candidates.findIndex(
//       c => c._id.toString() === candidateId
//     );
    
//     if (candidateIndex === -1) {
//       return res.status(404).json({ message: 'Candidate not found' });
//     }
    
//     // Update basic fields
//     skill.candidates[candidateIndex].name = name;
//     skill.candidates[candidateIndex].reason = reason;
    
//     // Update employee fields if provided
//     if (employeeId !== undefined) {
//       skill.candidates[candidateIndex].employeeId = employeeId;
//     }
    
//     if (email !== undefined) {
//       skill.candidates[candidateIndex].email = email;
//     }
    
//     if (department !== undefined) {
//       skill.candidates[candidateIndex].department = department;
//     }
    
//     if (designation !== undefined) {
//       skill.candidates[candidateIndex].designation = designation;
//     }
    
//     await skill.save();
//     res.status(200).json(skill);
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating candidate', error: error.message });
//   }
// };

// // Delete a candidate from a skill
// export const deleteCandidate = async (req, res) => {
//   const { skillId, candidateId } = req.params;
  
//   try {
//     // Get company code from authenticated user
//     const companyCode = req.companyCode;
    
//     // Get company-specific SkillZone model
//     const CompanySkillZone = await getModelForCompany(companyCode, 'SkillZone', skillZoneSchema);
    
//     // Find skill in company database
//     const skill = await CompanySkillZone.findById(skillId);
//     if (!skill) {
//       return res.status(404).json({ message: 'Skill not found' });
//     }
    
//     skill.candidates = skill.candidates.filter(
//       candidate => candidate._id.toString() !== candidateId
//     );
    
//     await skill.save();
//     res.status(200).json({ message: 'Candidate deleted successfully', skill });
//   } catch (error) {
//     res.status(500).json({ message: 'Error deleting candidate', error: error.message });
//   }
// };

// // Delete a skill
// export const deleteSkill = async (req, res) => {
//   const { skillId } = req.params;
  
//   try {
//     // Get company code from authenticated user
//     const companyCode = req.companyCode;
    
//     // Get company-specific SkillZone model
//     const CompanySkillZone = await getModelForCompany(companyCode, 'SkillZone', skillZoneSchema);
    
//     // Delete skill from company database
//     const deletedSkill = await CompanySkillZone.findByIdAndDelete(skillId);
//     if (!deletedSkill) {
//       return res.status(404).json({ message: 'Skill not found' });
//     }
    
//     res.status(200).json({ message: 'Skill deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error deleting skill', error: error.message });
//   }
// };

import SkillZone, { skillZoneSchema } from '../models/SkillZone.js';
import getModelForCompany from '../models/genericModelFactory.js';

// Get all skills
export const getAllSkills = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    // Get company-specific SkillZone model
    const CompanySkillZone = await getModelForCompany(companyCode, 'SkillZone', skillZoneSchema);
    
    // Get skills from company database
    const skills = await CompanySkillZone.find();
    console.log(`Retrieved ${skills.length} skills for company ${companyCode}`);
    res.status(200).json(skills);
  } catch (error) {
    console.error(`Error fetching skills:`, error);
    res.status(500).json({ 
      message: 'Error fetching skills', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Add a new skill
export const addSkill = async (req, res) => {
  const { name, candidates } = req.body;
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    // Validate required fields
    if (!name) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Skill name is required'
      });
    }
    
    // Get company-specific SkillZone model
    const CompanySkillZone = await getModelForCompany(companyCode, 'SkillZone', skillZoneSchema);
    
    // Create new skill in company database
    const newSkill = new CompanySkillZone({ name, candidates: candidates || [] });
    await newSkill.save();
    
    console.log(`Skill "${name}" created successfully for company ${companyCode}`);
    res.status(201).json(newSkill);
  } catch (error) {
    console.error('Error adding skill:', error);
    
    // Handle specific MongoDB errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation error',
        message: error.message,
        details: Object.values(error.errors).map(err => err.message)
      });
    }
    
    res.status(500).json({ 
      message: 'Error adding skill', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Add a candidate to a skill
export const addCandidate = async (req, res) => {
  const { skillId } = req.params;
  const { name, reason, addedOn, employeeId, email, department, designation } = req.body;
  
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    // Validate required fields
    if (!name || !reason) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Candidate name and reason are required'
      });
    }
    
    // Get company-specific SkillZone model
    const CompanySkillZone = await getModelForCompany(companyCode, 'SkillZone', skillZoneSchema);
    
    // Find skill in company database
    const skill = await CompanySkillZone.findById(skillId);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    
    // Create candidate object with all fields
    const candidateData = {
      name,
      reason,
      addedOn: addedOn || new Date().toLocaleDateString()
    };
    
    // Only add employee fields if they exist
    if (employeeId) candidateData.employeeId = employeeId;
    if (email) candidateData.email = email;
    if (department) candidateData.department = department;
    if (designation) candidateData.designation = designation;
    
    skill.candidates.push(candidateData);
    
    await skill.save();
    console.log(`Candidate "${name}" added to skill "${skill.name}" for company ${companyCode}`);
    res.status(200).json(skill);
  } catch (error) {
    console.error('Error adding candidate to skill:', error);
    
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(400).json({
        error: 'Invalid ID',
        message: 'The provided skill ID is not valid'
      });
    }
    
    res.status(500).json({ 
      message: 'Error adding candidate to skill', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Update a candidate in a skill
export const updateCandidate = async (req, res) => {
  const { skillId, candidateId } = req.params;
  const { name, reason, employeeId, email, department, designation } = req.body;
  
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    // Validate required fields
    if (!name || !reason) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Candidate name and reason are required'
      });
    }
    
    // Get company-specific SkillZone model
    const CompanySkillZone = await getModelForCompany(companyCode, 'SkillZone', skillZoneSchema);
    
    // Find skill in company database
    const skill = await CompanySkillZone.findById(skillId);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    
    const candidateIndex = skill.candidates.findIndex(
      c => c._id.toString() === candidateId
    );
    
    if (candidateIndex === -1) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    
    // Update basic fields
    skill.candidates[candidateIndex].name = name;
    skill.candidates[candidateIndex].reason = reason;
    
    // Update employee fields if provided
    if (employeeId !== undefined) {
      skill.candidates[candidateIndex].employeeId = employeeId;
    }
    
    if (email !== undefined) {
      skill.candidates[candidateIndex].email = email;
    }
    
    if (department !== undefined) {
      skill.candidates[candidateIndex].department = department;
    }
    
    if (designation !== undefined) {
      skill.candidates[candidateIndex].designation = designation;
    }
    
    await skill.save();
    console.log(`Candidate "${name}" updated in skill "${skill.name}" for company ${companyCode}`);
    res.status(200).json(skill);
  } catch (error) {
    console.error('Error updating candidate:', error);
    
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(400).json({
        error: 'Invalid ID',
        message: 'The provided skill or candidate ID is not valid'
      });
    }
    
    res.status(500).json({ 
      message: 'Error updating candidate', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Delete a candidate from a skill
export const deleteCandidate = async (req, res) => {
  const { skillId, candidateId } = req.params;
  
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    // Get company-specific SkillZone model
    const CompanySkillZone = await getModelForCompany(companyCode, 'SkillZone', skillZoneSchema);
    
    // Find skill in company database
    const skill = await CompanySkillZone.findById(skillId);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    
    const originalLength = skill.candidates.length;
    skill.candidates = skill.candidates.filter(
      candidate => candidate._id.toString() !== candidateId
    );
    
    if (skill.candidates.length === originalLength) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    
    await skill.save();
    console.log(`Candidate deleted from skill "${skill.name}" for company ${companyCode}`);
    res.status(200).json({ message: 'Candidate deleted successfully', skill });
  } catch (error) {
    console.error('Error deleting candidate:', error);
    
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(400).json({
        error: 'Invalid ID',
        message: 'The provided skill or candidate ID is not valid'
      });
    }
    
    res.status(500).json({ 
      message: 'Error deleting candidate', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Delete a skill
export const deleteSkill = async (req, res) => {
  const { skillId } = req.params;
  
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    // Get company-specific SkillZone model
    const CompanySkillZone = await getModelForCompany(companyCode, 'SkillZone', skillZoneSchema);
    
    // Delete skill from company database
    const deletedSkill = await CompanySkillZone.findByIdAndDelete(skillId);
    if (!deletedSkill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    
    console.log(`Skill "${deletedSkill.name}" deleted for company ${companyCode}`);
    res.status(200).json({ message: 'Skill deleted successfully' });
  } catch (error) {
    console.error('Error deleting skill:', error);
    
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(400).json({
        error: 'Invalid ID',
        message: 'The provided skill ID is not valid'
      });
    }
    
    res.status(500).json({ 
      message: 'Error deleting skill', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};
