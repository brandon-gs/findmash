// Retorna un array con el número de intentos necesarios para encontrar el número
export function binarySearch(array, target){
    let min = 0, 
        max = array.length-1,
        currentIndex = Math.floor((min + max) / 2),
        steps = [currentIndex];
    while(array[currentIndex] !== target){
        if(max < min) return -1 // The number doesn't exists in the array
        currentIndex = array[currentIndex] < target
        ? min = currentIndex + 1
        : max = currentIndex - 1;
        steps.push(currentIndex);
    }
    return steps;
}

// Return an array 
export function createArray(size){
    const array = [];
    for(let i = 1; i <= size; i++)
        array.push(i);
    return array;
}