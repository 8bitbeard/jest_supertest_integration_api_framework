import Joi from 'joi';
import { categorySchema } from '../../Categories/contracts/v1_categories.contract'

const expenseTransactionSchema = Joi.object({
  id: Joi.string().guid({version:'uuidv4'}),
  value: Joi.string(),
  created_at: Joi.date(),
  category: categorySchema
});

const errorSchema = Joi.object({
    code: Joi.string(),
    message: Joi.string(),
    details: Joi.array().items(Joi.string())
})

const errorTokenSchema = Joi.object({
  msg: Joi.string()
})

export { expenseTransactionSchema, errorSchema, errorTokenSchema };