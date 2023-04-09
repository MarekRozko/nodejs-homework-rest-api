const express = require('express')

const router = express.Router();

const contrl = require("../../controllers/contact-controllers")

const { validateBody } = require("../../utils");

const { schemas } = require("../../models/contacts")


router.get('/', contrl.listContacts)

router.get('/:contactId', contrl.getContactById )

router.post('/', validateBody(schemas.addSchema), contrl.addContact )

router.delete('/:contactId', contrl.removeContact )

router.put('/:contactId', validateBody(schemas.schemaUpdate), contrl.updateContact)

router.patch('/:contactId/favorite', validateBody(schemas.updateFavoriteSchema),  contrl.updateStatusContact )

module.exports = router
