/**
 * Fonction Helper pour les dates
 */
module.exports = {
    /**
     * Ajout d'une semaine à une date
     * @param date
     * @returns {Date}
     */
    addWeek: (date) => {
        const newDateTimestamp = date.getTime() + weekTimestamp() + getTimeZoneDiff() ;
        return new Date(newDateTimestamp);
    },

    /**
     * Formate une date au format DD/MM/YYYY
     * @param date
     * @returns string
     */
    formatDate: (date) => {
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    },

    /**
     * Formate une date au format DD/MM/YYYY HH:MM
     * @param date
     * @returns string
     */
    formatDateHour: (date) => {
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
    }
}

/**
 * return le timestamp d'une semaine
 * @returns {number}
 */
function weekTimestamp() { return 7 * 24 * 60 * 60 * 1000 }

/**
 * return lq différence d'heure entre GMT et le server
 * @returns {number}
 */
function getTimeZoneDiff() { return - (new Date()).getTimezoneOffset() * 60 * 1000 }
