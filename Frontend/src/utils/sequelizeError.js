export default (data) => {
    const errors = data.details.map((error) => { return { input: error.path[0], message: error.message } });
    return errors.reduce(function(result, item) { result[item.input] = item.message
        return result
    }, {});
}
