export default (type, params) => {
    const test = new RegExp(regex[type]);
    return test.exec(params) !== null ;
}

const regex = {
    slug: /^[\w-]+$/,
    id: /^\d+$/,
}
