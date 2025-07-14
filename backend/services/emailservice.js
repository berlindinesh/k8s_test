import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: `a.dineshsundar02@gmail.com`,
    pass: `xnbj tvjf odej ynit`
  }
});

// export const sendResignationEmail = async (resignationData) => {
//   const mailOptions = {
//     from: resignationData.email,  // Sender's email from the form
//     to: process.env.USER,         // Your configured email
//     subject: 'New Resignation Letter',
//     html: `
//       <div style="font-family: Arial, sans-serif; padding: 20px;">
//         <h2>Resignation Letter</h2>
//         <p><strong>From:</strong> ${resignationData.name}</p>
//         <p><strong>Email:</strong> ${resignationData.email}</p>
//         <p><strong>Position:</strong> ${resignationData.position}</p>
//         <p><strong>Status:</strong> ${resignationData.status}</p>
//         <div style="margin: 20px 0;">
//           <p><strong>Resignation Letter:</strong></p>
//           ${resignationData.description}
//         </div>
//       </div>
//     `
//   };

//   return await transporter.sendMail(mailOptions);
// };

export const sendResignationEmail = async (resignationData) => {
  // Determine if this is a status update notification
  const isStatusUpdate = resignationData.status === 'Approved' || resignationData.status === 'Rejected';
  
  const subject = isStatusUpdate 
    ? `Resignation Status Update: ${resignationData.status}`
    : 'New Resignation Letter';
  
  let emailContent = '';
  
  if (isStatusUpdate) {
    // Email template for status updates
    emailContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Resignation Status Update</h2>
        <p>Dear ${resignationData.name},</p>
        <p>Your resignation letter has been <strong>${resignationData.status.toLowerCase()}</strong>.</p>
        
        ${resignationData.reviewNotes ? `
        <div style="margin: 20px 0; padding: 15px; background-color: #f5f5f5; border-left: 4px solid #1976d2;">
          <p><strong>Review Notes:</strong></p>
          <p>${resignationData.reviewNotes}</p>
        </div>
        ` : ''}
        
        <div style="margin: 20px 0;">
          <p><strong>Original Resignation Letter:</strong></p>
          ${resignationData.description}
        </div>
        
        ${resignationData.reviewedBy ? `
        <p><strong>Reviewed by:</strong> ${resignationData.reviewedBy}</p>
        <p><strong>Review date:</strong> ${new Date(resignationData.reviewedAt).toLocaleDateString()}</p>
        ` : ''}
        
        <p>If you have any questions, please contact the HR department.</p>
      </div>
    `;
  } else {
    // Original email template for new resignation letters
    emailContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Resignation Letter</h2>
        <p><strong>From:</strong> ${resignationData.name}</p>
        <p><strong>Email:</strong> ${resignationData.email}</p>
        <p><strong>Position:</strong> ${resignationData.position}</p>
        <p><strong>Status:</strong> ${resignationData.status}</p>
        <div style="margin: 20px 0;">
          <p><strong>Resignation Letter:</strong></p>
          ${resignationData.description}
        </div>
      </div>
    `;
  }

  const mailOptions = {
    from: process.env.USER,  // Send from the configured email
    to: isStatusUpdate ? resignationData.email : process.env.USER, // Send to user or HR based on type
    subject: subject,
    html: emailContent
  };

  return await transporter.sendMail(mailOptions);
};

export const sendInvitationEmail = async (userData, password) => {
  const fullName = `${userData.firstName} ${userData.middleName ? userData.middleName + ' ' : ''}${userData.lastName}`;
  
  const mailOptions = {
    from: process.env.USER,  // Send from the configured email
    to: userData.email,
    subject: 'Welcome to HRMS - Your Account Invitation',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #1976d2;">Welcome to HRMS</h1>
        </div>
        
        <p>Dear ${fullName},</p>
        
        <p>You have been invited to join the HRMS platform for your company. Your account has been created with the following details:</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Email:</strong> ${userData.email}</p>
          <p><strong>Role:</strong> ${userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}</p>
          <p><strong>Company Code:</strong> ${userData.companyCode}</p>
          <p><strong>Temporary Password:</strong> ${password}</p>
        </div>
        
        <p>Please use these credentials to log in to the HRMS platform. You will be prompted to change your password after your first login.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/login" 
             style="background-color: #1976d2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">
            Login to HRMS
          </a>
        </div>
        
        <p>If you have any questions or need assistance, please contact your administrator.</p>
        
        <p>Thank you,<br>HRMS Team</p>
        
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #757575; text-align: center;">
          <p>This is an automated email. Please do not reply to this message.</p>
        </div>
      </div>
    `
  };
  return await transporter.sendMail(mailOptions);
};
