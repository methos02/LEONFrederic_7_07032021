module.exports = {
    orderSearch: (result) => {
        const resultUnion = result.flat().sort();
        const resultSorted = Array.from(new Set(resultUnion.map(item => item.id))).map(id => { return resultUnion.find(result => result.id === id) });

        return resultSorted.slice(0, 5);
    }
}
