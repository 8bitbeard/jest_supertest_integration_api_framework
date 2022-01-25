import Joi from 'joi';

const userSchema = Joi.object({
    id: Joi.string().guid({version:'uuidv4'}),
    name: Joi.string(),
    email: Joi.string()
});

const errorTokenSchema = Joi.object({
    msg: Joi.string()
})

export { userSchema, errorTokenSchema };