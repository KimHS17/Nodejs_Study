var arr = ['a', 'b', 'c', 1, 2];

for(i = 0; i < arr.length; i++) {
    console.log(arr[i]);
}
console.log(arr);
console.log(arr.length);

arr[4] = 3;
arr.push('Push');
console.log(arr);