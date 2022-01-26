import Joi from 'joi';
import { categorySchema } from '../../Categories/contracts/CategoryContract'

const transactionSchema = Joi.object({
  id: Joi.string().guid({version:'uuidv4'}),
  value: Joi.string(),
  created_at: Joi.date(),
  category: categorySchema
});

const transactionListSchema = Joi.array().items(transactionSchema);

const errorSchema = Joi.object({
    code: Joi.string(),
    message: Joi.string(),
    details: Joi.array().items(Joi.string())
})

const errorTokenSchema = Joi.object({
  msg: Joi.string()
})

export { transactionSchema, transactionListSchema, errorSchema, errorTokenSchema };