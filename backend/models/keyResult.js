import mongoose from 'mongoose';

const keyResultSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  objectiveId: { type: mongoose.Schema.Types.ObjectId, ref: 'Objective', required: true },
  completed: { type: Boolean, default: false },
  dueDate: { type: Date },
  assignee: { type: String }
}, { timestamps: true });

export default mongoose.model('KeyResult', keyResultSchema);
