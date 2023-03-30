const express = require('express')
const contacts = require('../../models/contacts')
const router = express.Router();
const Joi = require('joi');
const { HttpError } = require("../../helpers");

const addSchema = Joi.object({
 name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
  phone: Joi.string().required(),
});

const schemaUpdate = Joi.object({
  name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
  phone: Joi.string(),
}).or("name", "email", "phone");

router.get('/', async (req, res, next) => {
  const result = await contacts.listContacts();
  res.json(result)
})

router.get('/:contactId', async (req, res, next) => {
  try {
        const { contactId } = req.params;
        const result = await contacts.getContactById(contactId);
        if(!result) {
            throw HttpError(404, "Not found");
        }
        res.json(result);
    }
    catch(error) {
        next(error);
    }
})

router.post('/', async (req, res, next) => {
  try {
        const {error} = addSchema.validate(req.body);
        if(error) {
            throw HttpError(400, "missing required name field");
        }
        const result = await contacts.addContact(req.body);
        res.status(201).json(result);
    }
    catch(error) {
    next(error);
    }
})

router.delete('/:contactId', async (req, res, next) => {
  try {
        const {contactId} = req.params;
        const result = await contacts.removeContact(contactId);
        if(!result) {
            throw HttpError(404, "Not found");
        }
        res.json({
            message: "contact deleted"
        })
    }
    catch(error) {
        next(error);
    }
})

router.put('/:contactId', async (req, res, next) => {
  try {
        const {error} = schemaUpdate.validate(req.body);
        if(error) {
            throw HttpError(400, "missing fields");
        }
        const {contactId} = req.params;
        const result = await contacts.updateContact(contactId, req.body);
        if(!result) {
            throw HttpError(404, "Not found");
        }
        res.json(result);
    }
    catch(error) {
        next(error);
    }
})

module.exports = router
