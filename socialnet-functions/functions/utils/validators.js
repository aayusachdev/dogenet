/**
 * Method to check whether the entered email is valid or not
 *
 * @param {*} email
 * @returns true if the passed email is valid
 */
 const isValid = (email) => {
  const regex= "^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$";
  if (email.match(regex))
    return true;
  return false;
}

/**
 * Method to check whether a string is empty or not
 *
 * @param {*} string
 * @returns true if the passed string is empty
 */
const isEmpty = (string) => {
  if (string.trim() === '') // eliminate all the white spaces i.e. to make it no-empty
    return true;
  return false;
}

/**
 * Method returns the valid userData to be added into profile
 *
 * @param {*} data bio, website, location
 * @returns userDetails
 */
const reduceUserDetails = (data) => {

  let userDetails = {};
  if (!isEmpty(data.bio.trim())) userDetails.bio = data.bio;
  if (!isEmpty(data.website.trim())) {
    //https://website.com
    if (data.website.trim().substring(0, 4) !== 'http') {
      userDetails.website = `http://${data.website.trim()}`;
    } else userDetails.website = data.website;
  }
  if (!isEmpty(data.location.trim())) userDetails.location = data.location;
  return userDetails;
}

module.exports = { isEmpty, isValid , reduceUserDetails};