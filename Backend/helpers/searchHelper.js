/**
 * Ordonner la recherche d'utilisateur pour supprimer les doublons de la recherche par nom et par prénom puis ne garder que les 5 premiers résultat
 */
module.exports = {
    orderSearch: (result) => {
        const resultUnion = result.flat().sort();
        const resultSorted = Array.from(new Set(resultUnion.map(item => item.id))).map(id => { return resultUnion.find(result => result.id === id) });

        return resultSorted.slice(0, 5);
    }
}
