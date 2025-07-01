const mongoose = require('mongoose');
const { sendError } = require('../../utils/errorResponse');
const { getXUserId } = require('../../utils/getXUserId');
const Tenant = require('../../model/schema/tenant');
const User = require('../../model/schema/user');

const newTenant = async (req, res) => {
  try {
    const userId = getXUserId(req, res);
    if (!userId) return;

    const { name, description, active } = req.body;

    const existingTenant = await Tenant.findOne({ name });
    if (existingTenant)
      return sendError(
        res,
        409,
        'Tenant already exists. Please try another name.'
      );

    // Create the tenant
    const createdTenant = new Tenant({
      name,
      description,
      createdDate: new Date(),
      createdBy: userId,
      updatedBy: userId,
      active,
    });

    await createdTenant.save();

    res.status(200).json({
      message: 'Tenant created successfully',
    });
  } catch (error) {
    console.error(error);
    return sendError(res, 500, 'Failed to create tenant');
  }
};

const getTenants = async (req, res) => {
  try {
    const query = { ...req.query };

    let tenants = await Tenant.find(query)
      .populate('createdBy')
      .populate('updatedBy')
      .exec();

    res.status(200).json(tenants);
  } catch (error) {
    console.log(error);
    return sendError(res, 500, 'Failed to fetch tenants');
  }
};

const getTenant = async (req, res) => {
  try {
    let tenant = await Tenant.findOne({ _id: req.params.id })
      .populate('createdBy')
      .populate('updatedBy');

    if (!tenant) return sendError(res, 404, 'Tenant not found');

    res.status(200).json(tenant);
  } catch (error) {
    console.log(error);
    return sendError(res, 500, 'Failed to get tenant');
  }
};

const updateTenant = async (req, res) => {
  try {
    const userId = getXUserId(req, res);
    if (!userId) return;

    const tenantId = req.params.id;
    const { name, description, active } = req.body;

    // Optional: Validate input
    if (!name || typeof active !== 'boolean') {
      return sendError(res, 400, 'Invalid input');
    }

    const existingTenantByName = await Tenant.findOne({ name });

    // Check for duplicate name used by a different tenant
    if (
      existingTenantByName &&
      existingTenantByName._id.toString() !== tenantId
    ) {
      return sendError(
        res,
        409,
        'Tenant already exists. Please try another name.'
      );
    }

    const result = await Tenant.updateOne(
      { _id: tenantId },
      {
        $set: {
          name,
          description,
          active,
          updatedBy: userId,
          updatedDate: new Date(),
        },
      }
    );

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, 'Failed to update tenant');
  }
};

const setTenantActiveStatus = async (req, res) => {
  try {
    const userId = getXUserId(req, res);
    if (!userId) return;

    const { active } = req.body;

    if (typeof active !== 'boolean') {
      return sendError(res, 400, '`active` must be a boolean');
    }

    const result = await Tenant.updateOne(
      { _id: req.params.id },
      { $set: { active, updatedBy: userId, updatedDate: new Date() } }
    );

    res.status(200).json({
      message: `Tenant active status updated to ${active}`,
      result,
    });
  } catch (error) {
    console.log(error);
    return sendError(res, 500, 'Failed to update tenant active status');
  }
};

const getTenantUsers = async (req, res) => {
  try {
    const users = await User.find({ tenants: req.params.id }).populate(
      'tenants'
    );
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return sendError(res, 500, 'Failed to get tenant users');
  }
};

const getTenantExcludeUsers = async (req, res) => {
  try {
    const users = await User.find({
      tenants: { $nin: [new mongoose.Types.ObjectId(req.params.id)] },
      active: true,
    });
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return sendError(res, 500, 'Failed to get tenant excluded users');
  }
};

const addTenantToUsers = async (req, res) => {
  try {
    const tenantId = req.params.id;
    const { userIds } = req.body;

    const result = await User.updateMany(
      { _id: { $in: userIds } },
      {
        $addToSet: {
          tenants: tenantId,
        },
      }
    );
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return sendError(res, 500, 'Failed to add tenant to users');
  }
};

const removeTenantFromUsers = async (req, res) => {
  try {
    const tenantId = req.params.id;
    const { userIds } = req.body;

    const result = await User.updateMany(
      { _id: { $in: userIds } },
      {
        $pull: {
          tenants: tenantId,
        },
      }
    );
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, 'Failed to remove tenant from users');
  }
};

module.exports = {
  newTenant,

  getTenants,
  getTenant,

  updateTenant,
  setTenantActiveStatus,

  getTenantUsers,
  getTenantExcludeUsers,

  addTenantToUsers,
  removeTenantFromUsers,
};
