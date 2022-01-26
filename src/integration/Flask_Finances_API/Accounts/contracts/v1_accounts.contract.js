import Joi from 'joi';

const accountSchema = Joi.object({
  id: Joi.string().guid({version:'uuidv4'}),
  name: Joi.string(),
  income: Joi.string().regex(/^R\$ \-?[0-9]*,[0-9][0-9]$/),
  expense: Joi.string().regex(/^R\$ \-?[0-9]*,[0-9][0-9]$/),
  balance: Joi.string().regex(/^R\$ \-?[0-9]*,[0-9][0-9]$/)
});

const accountListSchema = Joi.array().items(
  Joi.object({
    id: Joi.string().guid({version:'uuidv4'}),
    name: Joi.string(),
    income: Joi.string().regex(/^R\$ \-?[0-9]*,[0-9][0-9]$/),
    expense: Joi.string().regex(/^R\$ \-?[0-9]*,[0-9][0-9]$/),
    balance: Joi.string().regex(/^R\$ \-?[0-9]*,[0-9][0-9]$/)
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

export { accountSchema, accountListSchema, errorSchema, errorTokenSchema };