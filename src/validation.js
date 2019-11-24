const joi = require('@hapi/joi');


module.exports.validateStringInput = function (input) {
  const { error } = joi.string().required().error(new Error('Value is required and MUST be a string')).validate(input);
  return error ? error.message : true;
}
module.exports.validateInput = function (input) {
  const { error } = joi.required().error(new Error('Value is required')).validate(input);
  return error ? error.message : true;
}
