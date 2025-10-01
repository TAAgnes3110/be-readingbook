const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.body
      ? schema.body.validate(req.body)
      : schema.params
        ? schema.params.validate(req.params)
        : schema.query
          ? schema.query.validate(req.query)
          : {}

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        errors: error.details.map((detail) => ({
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
