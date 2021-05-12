function isAllowed(current_user, post) {
    if(current_user.roles === undefined) { return false; }

    return current_user.id === post.UserId || current_user.roles.find( role => role === 'modo');
}

function isAdmin(current_user) {
    if(current_user.roles === undefined) { return false; }

    return current_user.roles.find( role => role === 'modo');
}

export { isAllowed, isAdmin }
