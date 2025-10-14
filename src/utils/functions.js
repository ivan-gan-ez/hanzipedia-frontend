export function isHanzi(hanzi) {
  if (hanzi.match(/[^\p{Ideographic}\u2f00-\u2fd5\u2e80-\u2fd5]/gu)) {
    return false;
  } else {
    return true;
  }
}

export function isUser(user) {
  if (user && user.role) {
    return true;
  } else {
    return false;
  }
}

export function isAdmin(user) {
  if (user && (user.role === "admin" || user.role === "owner")) {
    return true;
  } else {
    return false;
  }
}

export function isOwner(user) {
  if (user && user.role === "owner") {
    return true;
  } else {
    return false;
  }
}
