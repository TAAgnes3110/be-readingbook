const password = (value, helpers) => {
  if (value.length < 8) {
    return helpers.message('password must be at least 8 characters')
  }
  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    return helpers.message(
      'password must contain at least 1 letter and 1 number'
    )
  }
  return value
}

const confirmPassword = (value, helpers) => {
  const { password } = helpers.state.ancestors[0]
  if (value !== password) {
    return helpers.message('confirmPassword must match password')
  }
  return value
}

module.exports = {
  password,
  confirmPassword
}
