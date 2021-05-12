export default (text) => {
    if(text.length <= 500) return text;

    let abstract = text.slice(0, 500);

    while(abstract.slice(-1) !== ' ') {
        abstract = abstract.slice(0, -1);
    }

    return abstract + '...';
}
