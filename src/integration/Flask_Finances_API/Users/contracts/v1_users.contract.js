import Joi from 'joi';

const userSchema = Joi.object({
  id: Joi.string().guid({version:'uuidv4'}),
  name: Joi.string(),
  email: Joi.string()
});

const userListSchema = Joi.array().items(
  Joi.object({
    id: Joi.string().guid({version:'uuidv4'}),
    name: Joi.string(),
    email: Joi.string()
  })
);

const errorSchema = Joi.object({
    code: Joi.string(),
    message: Joi.string(),
    details: Joi.array().items(Joi.string())
})

export { userSchema, userListSchema, errorSchema };