const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendError } = require('../../utils/errorResponse');
const User = require('../../model/schema/user');

const generateRandomPassword = (length = 12) => {
  return crypto.randomBytes(length).toString('base64').slice(0, length);
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ username, active: true }).populate({
      path: 'roles',
    });
    if (!user) {
      return sendError(res, 401, 'Authentication failed, invalid username');
    }

    // Compare the provided password with the hashed password stored in the database
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return sendError(
        res,
        401,
        'Authentication failed, password does not match.'
      );
    }

    // Check if user is active
    if (!user.active) {
      return sendError(res, 401, 'Authentication failed, user is deactivated.');
    }

    // Create a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res
      .status(200)
      .setHeader('Authorization', `Bearer ${token}`)
      .json({ token: token, user });
  } catch (error) {
    return sendError(res, 500, 'Failed to login');
  }
};

// Admin register
const adminRegister = async (req, res) => {
  try {
    const { username, password, firstName, lastName, phoneNumber } = req.body;
    const user = await User.findOne({ username: username });
    if (user)
      return sendError(
        res,
        409,
        'Admin already exists. Please try another email.'
      );

    // Create a new user
    const newUser = new User({
      username,
      password: await bcrypt.hash(password, 10),
      email: username,
      firstName,
      lastName,
      phoneNumber,
      role: 'superAdmin',
    });

    // Save the user to the database
    await newUser.save();
    res.status(200).json({ message: 'Admin created successfully' });
  } catch (error) {
    return sendError(res, 500, 'Failed to register admin');
  }
};

// User Registration
const register = async (req, res) => {
  try {
    const { username, password, firstName, lastName, phoneNumber } = req.body;
    const { id } = req.user;

    const user = await User.findOne({ username: username });
    if (user)
      return sendError(
        res,
        409,
        'User already exist please try another email.'
      );

    // Create a new user
    const newUser = new User({
      username,
      password: await bcrypt.hash(password, 10),
      email: username,
      firstName,
      lastName,
      phoneNumber,
      createdDate: new Date(),
      createdBy: id,
      updatedBy: id,
    });

    // Save the user to the database
    await newUser.save();
    res.status(200).json({ message: 'User created successfully' });
  } catch (error) {
    return sendError(res, 500, 'Failed to register user');
  }
};

const newUser = async (req, res) => {
  try {
    const {
      userId,
      username,
      email,
      firstName,
      lastName,
      phoneNumber,
      role,
      active,
    } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser)
      return sendError(
        res,
        409,
        'User already exists. Please try another email.'
      );

    // Generate and hash password
    const plainPassword = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Create the user
    const createdUser = new User({
      username,
      password: hashedPassword,
      email,
      firstName,
      lastName,
      phoneNumber,
      role,
      createdDate: new Date(),
      createdBy: userId,
      updatedBy: userId,
      active,
    });

    await createdUser.save();

    res.status(200).json({
      message: 'User created successfully',
    });
  } catch (error) {
    console.error(error);
    return sendError(res, 500, 'Failed to register user');
  }
};

const getUsers = async (req, res) => {
  try {
    const query = { ...req.query };

    let users = await User.find(query)
      .populate({
        path: 'roles',
      })
      .exec();

    res.status(200).json(users);
  } catch (error) {
    return sendError(res, 500, 'Failed to fetch users');
  }
};

const getUser = async (req, res) => {
  try {
    let user = await User.findOne({ _id: req.params.id }).populate({
      path: 'roles',
    });
    if (!user) return sendError(res, 404, 'User not found');

    res.status(200).json(user);
  } catch (error) {
    return sendError(res, 500, 'Failed to get user');
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Assuming you have retrieved the user document using userId
    const user = await User.findById(userId);
    if (process.env.DEFAULT_USERS.includes(user?.username)) {
      return sendError(res, 400, `You don't have access to delete ${username}`);
    }

    if (!user) {
      return sendError(res, 404, `User not found'`);
    }

    if (user.role !== 'superAdmin') {
      // Update the user's 'active' field to false
      await User.updateOne({ _id: userId }, { $set: { active: false } });
      res.send({ message: 'Record deleted Successfully' });
    } else {
      return sendError(res, 400, `You cannot delete admin user`);
    }
  } catch (error) {
    return sendError(res, 500, 'Failed to delete user');
  }
};

const deleteUsers = async (req, res) => {
  try {
    const userIds = req.body; // req.body is an array of user IDs
    const users = await User.find({ _id: { $in: userIds } });

    // Check for default users and filter them out
    const defaultUsers = process.env.DEFAULT_USERS;
    const filteredUsers = users.filter(
      (user) => !defaultUsers.includes(user.username)
    );

    // Further filter out superAdmin users
    const nonSuperAdmins = filteredUsers.filter(
      (user) => user.role !== 'superAdmin'
    );
    const nonSuperAdminIds = nonSuperAdmins.map((user) => user._id);

    if (nonSuperAdminIds.length === 0) {
      return sendError(
        res,
        400,
        `No users to delete or all users are protected.`
      );
    }

    // Update the 'active' field to false for the remaining users
    const updatedUsers = await User.updateMany(
      { _id: { $in: nonSuperAdminIds } },
      { $set: { active: false } }
    );

    res
      .status(200)
      .json({ message: 'Successfully deleted users', updatedUsers });
  } catch (err) {
    return sendError(res, 500, 'Failed to delete users');
  }
};

const setUserActiveStatus = async (req, res) => {
  try {
    const { active } = req.body;

    if (typeof active !== 'boolean') {
      return sendError(res, 400, '`active` must be a boolean');
    }

    const result = await User.updateOne(
      { _id: req.params.id },
      { $set: { active } }
    );

    res.status(200).json({
      message: `User active status updated to ${active}`,
      result,
    });
  } catch (error) {
    return sendError(res, 500, 'Failed to update user active status');
  }
};

const editUserGeneral = async (req, res) => {
  try {
    const { firstName, lastName } = req.body;
    const result = await User.updateOne(
      { _id: req.params.id },
      { $set: { firstName, lastName } }
    );
    res.status(200).json(result);
  } catch (error) {
    return sendError(res, 500, 'Failed to update user general info');
  }
};

const editUserEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await User.updateOne(
      { _id: req.params.id },
      { $set: { email } }
    );
    res.status(200).json(result);
  } catch (error) {
    return sendError(res, 500, 'Failed to update user email');
  }
};

const editUserPhoneNumber = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    const result = await User.updateOne(
      { _id: req.params.id },
      { $set: { phoneNumber } }
    );
    res.status(200).json(result);
  } catch (error) {
    return sendError(res, 500, 'Failed to update user phone number');
  }
};

const updatePassword = async (req, res) => {
  try {
    let { currentPassword, newPassword } = req.body;

    // Find the user by id
    const user = await User.findOne({
      _id: req.params.id,
      active: true,
    }).populate('roles');
    if (!user) {
      return sendError(res, 401, 'Authentication failed, invalid username.');
    }

    // Compare the provided password with the hashed password stored in the database
    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      return sendError(
        res,
        401,
        'Authentication failed, current password does not match.'
      );
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    let result = await User.updateOne(
      { _id: req.params.id },
      {
        $set: {
          password: hashedNewPassword,
        },
      }
    );

    res.status(200).json(result);
  } catch (err) {
    return sendError(res, 500, 'Failed to update user password');
  }
};

const changeRoles = async (req, res) => {
  try {
    const userId = req.params.id;

    let result = await User.updateOne(
      { _id: userId },
      { $set: { roles: req.body } }
    );

    res.status(200).json(result);
  } catch (error) {
    return sendError(res, 500, 'Failed to change roles');
  }
};

module.exports = {
  login,
  adminRegister,
  register,

  newUser,

  getUsers,
  getUser,

  deleteUser,
  deleteUsers,

  setUserActiveStatus,

  editUserGeneral,
  editUserEmail,
  editUserPhoneNumber,

  updatePassword,
  changeRoles,
};
