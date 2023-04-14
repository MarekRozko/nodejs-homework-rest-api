const {Contacts} = require("../models/contacts")
const {contrlWrapper} = require("../utils")
const { HttpError } = require("../helpers");



const listContacts = async (req, res) => {
    const {_id: owner} = req.user;
    const {page = 1, limit = 20, favorite} = req.query; 
    const skip = (page - 1) * limit;

    const filter = { owner };
    if (favorite !== undefined) { 
        filter.favorite = favorite; 
    }

    const result = await Contacts.find(filter, "name email phone favorite", {
        skip, limit: Number(limit),
    }).populate("owner", "email");

    res.json(result);
}

const getContactById = async (req, res) => {
        const { contactId } = req.params;
        const result = await Contacts.findById(contactId);
        if(!result) {
            throw HttpError(404, "Not found");
        }
        res.json(result);
}

const addContact = async (req, res) => {
    const {_id: owner} = req.user;
    const result = await Contacts.create({...req.body, owner});
    res.status(201).json(result);
}

const removeContact = async (req, res) => {
        const {contactId} = req.params;
        const result = await Contacts.findOneAndDelete({contactId, owner: _id,});
        if(!result) {
            throw HttpError(404, "Not found");
        }
        res.json({
            message: "contact deleted"
        })
}

const updateContact = async (req, res) => {

    const { contactId } = req.params;
    const { faavorite } = req.body;
    if (!faavorite) {
        throw HttpError(400, "missing field favorite");
    }
    const result = await Contacts.findByIdAndUpdate({contactId,owner: _id,}, req.body, {new: true});
    if(!result) {
        throw HttpError(404, "Not found");
    }
        res.json(result);
}
const updateStatusContact = async (req, res) => {
    const { contactId } = req.params;
    const result = await Contacts.findByIdAndUpdate(contactId, req.body, { new: true });
    if(!result) {
            throw HttpError(404, "Not found");
    }
    res.json(result);
}

module.exports = {
    listContacts: contrlWrapper(listContacts),
    getContactById: contrlWrapper(getContactById),
    addContact: contrlWrapper(addContact),
    removeContact: contrlWrapper(removeContact),
    updateContact: contrlWrapper(updateContact),
    updateStatusContact:contrlWrapper(updateStatusContact),
}