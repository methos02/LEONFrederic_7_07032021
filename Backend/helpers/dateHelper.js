module.exports = {
    addWeek: (date) => {
        const newDateTimestamp = date.getTime() + weekTimestamp() + getTimeZoneDiff() ;
        return new Date(newDateTimestamp);
    },
    formatDate: (date) => {
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    }
}

function weekTimestamp() { return 7 * 24 * 60 * 60 * 1000 }
function getTimeZoneDiff() { return - (new Date()).getTimezoneOffset() * 60 * 1000 }
