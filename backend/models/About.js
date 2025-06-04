const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  period: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

const aboutSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  skills: [{
    type: String,
    required: true
  }],
  experience: [experienceSchema]
}, {
  timestamps: true
});

// Ensure only one document exists
aboutSchema.pre('save', async function(next) {
  const About = this.constructor;
  if (this.isNew) {
    const count = await About.countDocuments();
    if (count > 0) {
      const err = new Error('Only one About document can exist');
      next(err);
    }
  }
  next();
});

module.exports = mongoose.model('About', aboutSchema); 