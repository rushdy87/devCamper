exports.isTheOwner = (user, resourceUserId) => {
  if (user.role === "admin") {
    return true;
  }
  return user.id === resourceUserId.toString();
};
