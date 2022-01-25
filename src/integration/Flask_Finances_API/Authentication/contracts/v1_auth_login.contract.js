import Joi from 'joi';

const validLoginSchema = Joi.object({
    name: Joi.string(),
    email: Joi.string(),
    access: Joi.string(),
    refresh: Joi.string()
});

const errorLoginSchema = Joi.object({
    code: Joi.string(),
    message: Joi.string(),
    details: Joi.array().items(Joi.string())
})

export { validLoginSchema, errorLoginSchema };