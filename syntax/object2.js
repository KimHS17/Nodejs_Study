var f = function() {
    console.log(1+1);
}

var a = [f];
a[0]();

var b = f;
b();

var o = {
    func:f
}
o.func();