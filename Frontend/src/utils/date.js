export function compareDate(date_1, date_2 = undefined) {
    date_1 = new Date(date_1);
    date_2 = date_2 === undefined ? new Date() : new Date(date_2);

    return date_1 > date_2;
}

export default { compareDate }
