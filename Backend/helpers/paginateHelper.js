const constante = {
    PAGINATE_LIMITE: 6,
}

module.exports = {
    constante,
    formatResponse: (result, current_page) => {
        return {
            rows : result.rows,
            paginate: {
                current_page: parseInt(current_page) + 1,
                last_page: Math.ceil(result.count / constante.PAGINATE_LIMITE),
            }
        };
    },
    getPage: (query) => {
        return query.page !== undefined ? query.page - 1 : 0;
    }
}

