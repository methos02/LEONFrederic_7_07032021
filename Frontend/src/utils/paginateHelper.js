export default (page) => {
    return page !== undefined ? '?page=' + page : ''
}
