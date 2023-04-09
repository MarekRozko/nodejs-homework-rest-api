const {Contacts} = require("../models/contacts")
const {contrlWrapper} = require("../utils")
const { HttpError } = require("../helpers");



const listContacts = async (req, res) => {

    const result = await Contacts.find();
        res.json(result) 

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

        const result = await Contacts.create(req.body);
        res.status(201).json(result);
}

const removeContact = async (req, res) => {
        const {contactId} = req.params;
        const result = await Contacts.findByIdAndDelete(contactId);
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
    const result = await Contacts.findByIdAndUpdate(contactId, req.body, {new: true});
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