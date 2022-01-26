import Joi from 'joi';

const categorySchema = Joi.object({
  id: Joi.string().guid({version:'uuidv4'}),
  name: Joi.string(),
  type: Joi.string().valid('Entrada','Saída').required()
});

const categoryListSchema = Joi.array().items(
  Joi.object({
    id: Joi.string().guid({version:'uuidv4'}),
    name: Joi.string(),
    type: Joi.string().valid('Entrada','Saída').required()
  })
);

const errorSchema = Joi.object({
    code: Joi.string(),
    message: Joi.string(),
    details: Joi.array().items(Joi.string())
})

const errorTokenSchema = Joi.object({
  msg: Joi.string()
})

export { categorySchema, categoryListSchema, errorSchema, errorTokenSchema };