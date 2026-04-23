const Item = require('../models/Item');

// @desc    Get items
// @route   GET /api/items
// @access  Public
const getItems = async (req, res) => {
    try {
        const { name } = req.query;
        let query = {};
        if (name) {
            query.itemName = { $regex: name, $options: 'i' };
        }
        const items = await Item.find(query).populate('user', 'name');
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get item by ID
// @route   GET /api/items/:id
// @access  Public
const getItemById = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id).populate('user', 'name');
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add item
// @route   POST /api/items
// @access  Private
const addItem = async (req, res) => {
    try {
        const { itemName, description, type, location, date, contactInfo } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : req.body.imageUrl;

        const item = await Item.create({
            itemName,
            description,
            type,
            location,
            date,
            contactInfo,
            imageUrl,
            user: req.user.id,
        });

        res.status(201).json(item);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update item
// @route   PUT /api/items/:id
// @access  Private
const updateItem = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Check for user
        if (!req.user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Make sure the logged in user matches the item user
        if (item.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        const updateData = { ...req.body };
        if (req.file) {
            updateData.imageUrl = `/uploads/${req.file.filename}`;
        }

        const updatedItem = await Item.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
        });

        res.status(200).json(updatedItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete item
// @route   DELETE /api/items/:id
// @access  Private
const deleteItem = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Check for user
        if (!req.user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Make sure the logged in user matches the item user
        if (item.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await item.deleteOne();

        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getItems,
    getItemById,
    addItem,
    updateItem,
    deleteItem,
};
