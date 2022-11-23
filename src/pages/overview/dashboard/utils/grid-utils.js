const convertToGridIndex = (index, list) => {
    if (list === 'list1') {
        return 2 * index;
    }
    return (2 * index) + 1;
}

const splitWithIndex = function (array, index) {
    const left = [], right = [];
    for (let i = 0; i < array.length; i++) {
        if (i < index) {
            left.push(array[i]);
        } else {
            right.push(array[i])
        }
    }
    return [left, right]
}

function reArrangeTheDeck(oldIndex, cards, newIndex, item) {
    // console.log('old: ', oldIndex, 'new: ', newIndex, cards, item)
    if (oldIndex === -1) {
        return cards;
    }
    cards.splice(oldIndex, 1);
    const [left, right] = splitWithIndex(cards, newIndex);
    left.push(item, ...right);
    return left;
}

const gridUtils = {
    added(cards, newIndex = 0, item) {
        const oldIndex = cards.findIndex(x => x === item);
        return reArrangeTheDeck(oldIndex, cards, newIndex, item);
    },
    moved(cards, newIndex = 0, oldIndex, item) {
        return reArrangeTheDeck(oldIndex, cards, newIndex, item);
    }
}
export {gridUtils, splitWithIndex, convertToGridIndex}