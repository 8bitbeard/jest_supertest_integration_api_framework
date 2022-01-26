import Joi from 'joi';

const balanceSchema = Joi.object({
  balance: Joi.string().regex(/^R\$ \-?[0-9]*,[0-9][0-9]$/)
});

const errorSchema = Joi.object({
    code: Joi.string(),
    message: Joi.string(),
    details: Joi.array().items(Joi.string())
})

const errorTokenSchema = Joi.object({
  msg: Joi.string()
})

export { balanceSchema, errorSchema, errorTokenSchema };