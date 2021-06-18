import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  photo: Object,
});

export const User = mongoose.model('User', userSchema);
