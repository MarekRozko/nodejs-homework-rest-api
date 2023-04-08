const {Schema, model } = require("mongoose");
const Joi = require("joi");


const contactSchema = new Schema({

    name: {
        type: String,
        required: [true, 'Set name for contact'],
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    },
    favorite: {
        type: Boolean,
        default: false,
    },
  
}, { versionKey: false, timestamps: true });



const addSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean()
});

const schemaUpdate = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    phone: Joi.string().required(),
  favorite: Joi.boolean()
})

const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean()
})

const schemas = {
    addSchema,
    updateFavoriteSchema,
    schemaUpdate,
}



const Contacts = model("contacts", contactSchema);

module.exports = {
  Contacts,
  schemas,
}