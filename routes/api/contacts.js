const express = require('express')

const router = express.Router();

const contrl = require("../../controllers/contact-controllers")

const {isValidId, authenticate} = require("../../middlewares")
const { validateBody } = require("../../utils");

const { schemas } = require("../../models/contacts")


router.get('/', authenticate, contrl.listContacts)

router.get('/:contactId', authenticate, isValidId, contrl.getContactById )

router.post('/', authenticate, validateBody(schemas.addSchema), contrl.addContact )

router.delete('/:contactId', authenticate, isValidId, contrl.removeContact )

router.put('/:contactId', authenticate, isValidId, validateBody(schemas.schemaUpdate), contrl.updateContact)

router.patch('/:contactId/favorite', authenticate, isValidId, validateBody(schemas.updateFavoriteSchema),  contrl.updateStatusContact )

module.exports = router
