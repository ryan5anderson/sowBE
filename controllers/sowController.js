const SoW = require('../models/SoW');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

// @desc Get all SoWs
// @route GET /sows
// @access Private
const getAllSoWs = asyncHandler(async (req, res) => {
    const sows = await SoW.find().lean();

    if (!sows?.length) {
        return res.status(400).json({ message: 'No SoWs found' });
    }

    const sowsWithUser = await Promise.all(sows.map(async (sow) => {
        const user = await User.findById(sow.user).lean().exec();
        return { ...sow, username: user.username };
    }));

    res.json(sowsWithUser);
});

// @desc Create new SoW
// @route POST /sows
// @access Private
const createNewSoW = asyncHandler(async (req, res) => {
    const { user, name, type, vms, landing_zones, hours, months, engineer_hourly, architect_hourly, pm_hourly } = req.body;

    if (!user || !name) {
        return res.status(400).json({ message: 'Required fields are missing' });
    }

    const sowObject = { user, name, type, vms, landing_zones, hours, months, engineer_hourly, architect_hourly, pm_hourly };
    const sow = await SoW.create(sowObject);

    if (sow) {
        return res.status(201).json({ message: 'New SoW created' });
    } else {
        return res.status(400).json({ message: 'Invalid SoW data received' });
    }
});

// @desc Update a SoW
// @route PATCH /sows
// @access Private
const updateSoW = asyncHandler(async (req, res) => {
    const { id, user, name, type, vms, landing_zones, hours, months, engineer_hourly, architect_hourly, pm_hourly } = req.body;

    const sow = await SoW.findById(id).exec();

    if (!sow) {
        return res.status(400).json({ message: 'SoW not found' });
    }

    sow.user = user;
    sow.name = name;
    sow.type = type;
    sow.vms = vms;
    sow.landing_zones = landing_zones;
    sow.hours = hours;
    sow.months = months;
    sow.engineer_hourly = engineer_hourly;
    sow.architect_hourly = architect_hourly;
    sow.pm_hourly = pm_hourly;

    const updatedSoW = await sow.save();

    res.json(`'${updatedSoW.name}' updated`);
});

// @desc Delete a SoW
// @route DELETE /sows
// @access Private
const deleteSoW = asyncHandler(async (req, res) => {
    const { id } = req.body;

    const sow = await SoW.findById(id).exec();

    if (!sow) {
        return res.status(400).json({ message: 'SoW not found' });
    }

    const result = await sow.deleteOne();
    const reply = `SoW '${result.name}' with ID ${result._id} deleted`;

    res.json(reply);
});

module.exports = {
    getAllSoWs,
    createNewSoW,
    updateSoW,
    deleteSoW
};
