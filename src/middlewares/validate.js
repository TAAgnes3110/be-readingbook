const validate = (schema) => {
  return (req, res, next) => {
    let validationResult = { error: null, value: {} }

    // Validate body
    if (schema.body) {
      validationResult = schema.body.validate(req.body, { stripUnknown: false })
      if (validationResult.value) {
        req.body = validationResult.value
      }
    }

    // Validate params
    if (schema.params && !validationResult.error) {
      validationResult = schema.params.validate(req.params, { stripUnknown: false })
      if (validationResult.value) {
        req.params = validationResult.value
      }
    }

    // Validate query
    if (schema.query && !validationResult.error) {
      validationResult = schema.query.validate(req.query, { stripUnknown: false })
      if (validationResult.value) {
        req.query = validationResult.value
      }
    }

    if (validationResult.error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid data',
        errors: validationResult.error.details.map((detail) => ({
          message: detail.message,
          path: detail.path,
          type: detail.type
        }))
      })
    }

    next()
  }
}

module.exports = validate
