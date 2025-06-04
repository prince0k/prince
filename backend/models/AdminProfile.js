const mongoose = require('mongoose');

const adminProfileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  bio: {
    type: String,
    trim: true
  },
  profileImage: {
    type: String
  },
  socialLinks: {
    github: String,
    linkedin: String,
    twitter: String,
    email: String
  },
  homePageContent: {
    title: {
      type: String,
      default: 'Full Stack Developer'
    },
    subtitle: {
      type: String,
      default: 'Creating modern web applications'
    },
    description: {
      type: String,
      default: 'Welcome to my portfolio'
    }
  }
}, {
  timestamps: true
});

// Static method to update profile
adminProfileSchema.statics.updateProfile = async function(profileData) {
  const AdminProfile = this;
  
  // Find the first profile or create if none exists
  let profile = await AdminProfile.findOne();
  if (!profile) {
    profile = new AdminProfile(profileData);
  } else {
    // Update existing profile
    Object.assign(profile, profileData);
  }
  
  await profile.save();
  return profile;
};

const AdminProfile = mongoose.model('AdminProfile', adminProfileSchema);

module.exports = AdminProfile;