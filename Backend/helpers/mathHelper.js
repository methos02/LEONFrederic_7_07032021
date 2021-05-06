const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
};

module.exports = {
    getRandomInt ,
    getRandomUniqInt: function(min, max, used_ints) {
        let int;

        do {
            int = getRandomInt(min, max);
        }
        while (used_ints.find( used_int => used_int === int))

        return int;
    }
}
