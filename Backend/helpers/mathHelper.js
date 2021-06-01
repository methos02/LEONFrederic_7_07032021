/**
 * génére un chiffre aléatoire
 * @param min
 * @param max
 * @returns {number}
 */
const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
};

/**
 * Helper pour les fonction mathématiques
 */
module.exports = {
    getRandomInt ,
    /**
     * génére un chiffre aléatoire unique
     * @param min
     * @param max
     * @param used_ints
     * @returns {number}
     */
    getRandomUniqInt: function(min, max, used_ints) {
        let int;

        do {
            int = getRandomInt(min, max);
        }
        while (used_ints.find( used_int => used_int === int))

        return int;
    }
}
