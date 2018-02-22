
/**
 * @param {!number} maxInt A positive nonzero integer
 * @return {!number} A random integer between 0 and maxInt-1
 */
export function randomInt(maxInt) {
    return Math.floor(Math.random() * maxInt);
}


/**
 * @template T
 * @param {!Array.<T>} oldArray
 * @return {!Array.<T>}
 */
export function shuffle(oldArray) {
    const newArray = [];
    for (let i = 0, l = oldArray.length; i < l; i++) {
        newArray.splice(randomInt(i+1), 0, oldArray[i]);
    }
    return newArray;
}