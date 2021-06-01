const constante = {
    PAGINATE_LIMITE: 6,
}

/**
 * Helper pour la pagination
 */
module.exports = {
    constante,
    /**
     * Formatage du résultat de sequelize pour le front
     * @param result
     * @param current_page
     * @returns {{paginate: {last_page: number, current_page: number}, rows: *}}
     */
    formatResponse: (result, current_page) => {
        return {
            rows : result.rows,
            paginate: {
                current_page: parseInt(current_page) + 1,
                last_page: Math.ceil(result.count / constante.PAGINATE_LIMITE),
            }
        };
    },
    /**
     * définie la page
     */
    getPage: (query) => {
        return query.page !== undefined ? query.page - 1 : 0;
    }
}

