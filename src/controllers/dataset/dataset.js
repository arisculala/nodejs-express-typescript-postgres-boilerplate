const { sendError } = require('../../utils/errorResponse');
const { getXUserId } = require('../../utils/getXUserId');
const Dataset = require('../../model/schema/dataset');

const newDataset = async (req, res) => {
  try {
    const userId = getXUserId(req, res);
    if (!userId) return;

    const { ownerTenantId, name, description, sharedWithTenants } = req.body;

    const existingDataset = await Dataset.findOne({ name });
    if (existingDataset)
      return sendError(
        res,
        409,
        'Dataset already exists. Please try another name.'
      );

    // Create the dataset
    const createdDataset = new Dataset({
      ownerTenantId,
      name,
      description,
      sharedWithTenants,
      createdDate: new Date(),
      createdBy: userId,
      updatedBy: userId,
    });

    await createdDataset.save();

    res.status(200).json({
      message: 'Dataset created successfully',
    });
  } catch (error) {
    console.error(error);
    return sendError(res, 500, 'Failed to create dataset');
  }
};

const getDatasets = async (req, res) => {
  try {
    const query = { ...req.query };

    let datasets = await Dataset.find(query)
      //.populate('ownerTenantId', 'name _id') // specific field
      .populate('ownerTenantId')
      .populate('sharedWithTenants')
      .populate('createdBy')
      .populate('updatedBy')
      .exec();

    res.status(200).json(datasets);
  } catch (error) {
    console.log(error);
    return sendError(res, 500, 'Failed to fetch datasets');
  }
};

const getDataset = async (req, res) => {
  try {
    let dataset = await Dataset.findOne({ _id: req.params.id })
      .populate('ownerTenantId')
      .populate('sharedWithTenants')
      .populate('createdBy')
      .populate('updatedBy');

    if (!dataset) return sendError(res, 404, 'Dataset not found');

    res.status(200).json(dataset);
  } catch (error) {
    console.log(error);
    return sendError(res, 500, 'Failed to get dataset');
  }
};

const updateDataset = async (req, res) => {
  try {
    const userId = getXUserId(req, res);
    if (!userId) return;

    const { name, description, sharedWithTenants } = req.body;
    const existingDataset = await Dataset.findOne({ name });
    if (existingDataset)
      return sendError(
        res,
        409,
        'Dataset already exists. Please try another name.'
      );

    const result = await Dataset.updateOne(
      { _id: req.params.id },
      {
        $set: {
          name,
          description,
          sharedWithTenants,
          updatedBy: userId,
          updatedDate: new Date(),
        },
      }
    );
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return sendError(res, 500, 'Failed to update dataset name');
  }
};

module.exports = {
  newDataset,

  getDatasets,
  getDataset,

  updateDataset,
};
