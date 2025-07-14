import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create a transporter with Gmail-specific settings
const transporter = nodemailer.createTransport({
  service: 'gmail',  // Use 'gmail' service instead of custom host/port
  auth: {
    user: process.env.USER || 'rickyharish30@gmail.com',
    pass: process.env.PASS || 'irnb atlq oani ytlq',
  }
});

/**
 * Send a reminder email
 */
export const sendReminderEmail = async (options) => {
  try {
    console.log('Sending reminder email to:', options.to);
    
    // Format dates
    const formattedDueDate = options.dueDate ? new Date(options.dueDate).toLocaleDateString() : 'Not specified';
    const formattedReminderDate = options.reminderDate ? new Date(options.reminderDate).toLocaleString() : 'Not specified';
    
    // Prepare recipients - ensure it's a string
    const recipients = Array.isArray(options.to) ? options.to.join(', ') : options.to;
    
    // Create priority label with color
    let priorityLabel;
    switch (options.priority) {
      case 'High':
        priorityLabel = '<span style="color: #e53935; font-weight: bold;">High Priority</span>';
        break;
      case 'Critical':
        priorityLabel = '<span style="color: #d32f2f; font-weight: bold; text-transform: uppercase;">CRITICAL</span>';
        break;
      case 'Low':
        priorityLabel = '<span style="color: #43a047;">Low Priority</span>';
        break;
      default:
        priorityLabel = '<span style="color: #fb8c00;">Medium Priority</span>';
    }
    
    // Create email HTML
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #1976d2; margin-top: 0;">Feedback Reminder</h2>
        <p>This is a reminder for the following feedback:</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <h3 style="margin-top: 0;">${options.feedbackTitle || 'Feedback'}</h3>
          <p><strong>Due Date:</strong> ${formattedDueDate}</p>
          <p><strong>Priority:</strong> ${priorityLabel}</p>
          <p><strong>Reminder Note:</strong> ${options.reminderNote || 'No note provided'}</p>
        </div>
        
        <p>Please complete this feedback before the due date.</p>
        
        <div style="margin-top: 30px; text-align: center;">
          <a href="http://localhost:3000/feedback" 
             style="background-color: #1976d2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">
            View Feedback
          </a>
        </div>
        
        <p style="margin-top: 30px; font-size: 12px; color: #757575; text-align: center;">
          This reminder was scheduled for ${formattedReminderDate}
        </p>
      </div>
    `;
    
    // Send email
    const mailOptions = {
      from: `"HRMS Feedback System" <rickyharish30@gmail.com>`,
      to: recipients,
      subject: options.subject || 'Feedback Reminder',
      html: html
    };
    
    const result = await transporter.sendMail(mailOptions);
    console.log('Reminder email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('Error sending reminder email:', error);
    throw error;
  }
};

// Export a test function to verify email functionality
export const testEmailService = async () => {
  try {
    const result = await sendReminderEmail({
      to: 'test@example.com',
      subject: 'Test Email',
      feedbackTitle: 'Test Feedback',
      reminderNote: 'This is a test email',
      dueDate: new Date(),
      reminderDate: new Date(),
      priority: 'Medium'
    });
    return { success: true, messageId: result.messageId };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
