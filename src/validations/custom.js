const { getUserError } = require('../constants/errorMessages')

const password = (value, helpers) => {
  if (value.length < 8) {
    return helpers.message(getUserError('PASSWORD_TOO_SHORT'))
  }
  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    return helpers.message(getUserError('PASSWORD_TOO_WEAK'))
  }
  return value
}

const confirmPassword = (value, helpers) => {
  const { password } = helpers.state.ancestors[0]
  if (value !== password) {
    return helpers.message(getUserError('PASSWORD_MISMATCH'))
  }
  return value
}

module.exports = {
  password,
  confirmPassword
}
