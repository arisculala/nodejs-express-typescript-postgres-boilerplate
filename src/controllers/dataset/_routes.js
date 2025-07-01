const express = require('express');
const dataset = require('./dataset');
const auth = require('../../middelwares/auth');

const router = express.Router();

router.post('/', auth, dataset.newDataset);
router.get('/', auth, dataset.getDatasets);
router.get('/:id', auth, dataset.getDataset);
router.put('/:id', auth, dataset.updateDataset);

module.exports = router;
