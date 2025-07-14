import cron from 'node-cron';
import Feedback from '../models/Feedback.js';
import { sendReminderEmail } from './sendremindermail.js';

// Run every hour to check for due reminders
export const startReminderScheduler = () => {
  cron.schedule('0 * * * *', async () => {
    console.log('Running reminder check...');
    
    try {
      const now = new Date();
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
      
      // Find feedbacks with reminders due in the last 5 minutes
      // This prevents sending the same reminder multiple times
      const feedbacks = await Feedback.find({
        'reminders.reminderDate': { 
          $gte: fiveMinutesAgo, 
          $lte: now 
        },
        'reminders.isCompleted': false,
        'reminders.isEmailNotification': true
      });
      
      for (const feedback of feedbacks) {
        const dueReminders = feedback.reminders.filter(r => 
          new Date(r.reminderDate) >= fiveMinutesAgo && 
          new Date(r.reminderDate) <= now && 
          !r.isCompleted &&
          r.isEmailNotification
        );
        
        for (const reminder of dueReminders) {
          for (const recipient of reminder.recipients) {
            try {
              // In a real app, you would fetch the email from your user database
              let recipientEmail = recipient;
              let recipientName = recipient.split('@')[0]; // Default name from email
              
              // If recipient is in format "Name <email@example.com>"
              const emailMatch = recipient.match(/<(.+)>/);
              if (emailMatch) {
                recipientEmail = emailMatch[1];
                recipientName = recipient.split('<')[0].trim();
              }
              
              await sendReminderEmail({
                feedbackTitle: feedback.title,
                reminderNote: reminder.reminderNote,
                dueDate: feedback.dueDate,
                recipientEmail,
                recipientName
              });
              
              console.log(`Reminder email sent to ${recipientEmail} for feedback ${feedback.title}`);
            } catch (error) {
              console.error(`Error sending reminder email to ${recipient}:`, error);
            }
          }
          
          // Mark reminder as completed
          reminder.isCompleted = true;
        }
        
        await feedback.save();
      }
    } catch (error) {
      console.error('Error processing reminders:', error);
    }
  });
  
  console.log('Reminder scheduler started');
};
