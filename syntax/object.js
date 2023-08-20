var members = ['egoing', 'k8805', 'hoya'];
console.log(members[1]);

var roles = {
    'programmer':'egoing',
    'dseigner':'k8805',
    'manager':'hoya'
}
console.log(roles.dseigner);

for(var name in roles) {
    console.log(name, roles[name]);
}