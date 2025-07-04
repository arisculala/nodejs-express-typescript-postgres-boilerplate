const mongoose = require('mongoose');
const User = require('../model/schema/user');
const bcrypt = require('bcrypt');

const initializedSchemas = async () => {};

const connectDB = async (DATABASE_URL, DATABASE) => {
  try {
    const DB_OPTIONS = {
      dbName: DATABASE,
    };

    mongoose.set('strictQuery', false);
    await mongoose.connect(DATABASE_URL, DB_OPTIONS);

    await initializedSchemas();

    let adminExisting = await User.find({ role: 'superAdmin' });
    if (adminExisting.length <= 0) {
      const phoneNumber = 7874263694;
      const firstName = 'admin';
      const lastName = 'admin';
      const username = 'admin@admin.com';
      const password = 'admin123';
      const email = 'admin@admin.com';
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      // Create a new user
      const user = new User({
        _id: new mongoose.Types.ObjectId('64d33173fd7ff3fa0924a109'),
        username,
        password: hashedPassword,
        email,
        firstName,
        lastName,
        phoneNumber,
        role: 'superAdmin',
        createDate: Date.now(),
        createdBy: new mongoose.Types.ObjectId('64d33173fd7ff3fa0924a109'),
        updatedDate: Date.now(),
        updatedBy: new mongoose.Types.ObjectId('64d33173fd7ff3fa0924a109'),
      });
      // Save the user to the database
      await user.save();
      console.log('Admin created successfully..');
    } else if (adminExisting[0].active === true) {
      await User.findByIdAndUpdate(adminExisting[0]._id, { active: true });
      console.log('Admin Update successfully..');
    } else if (adminExisting[0].username !== 'admin@gmail.com') {
      await User.findByIdAndUpdate(adminExisting[0]._id, {
        username: 'admin@admin.com',
      });
      console.log('Admin Update successfully..');
    }

    console.log('Database Connected Successfully..');
  } catch (err) {
    console.log('Database Not connected', err.message);
  }
};
module.exports = connectDB;
