var Site = (function() {
    var privateVar = 1;

    function privateMethod() {}

    return {
        publicVar: privateVar,
        publicObj: {
            var1: 1,
            var2: 2
        },
        publicMethod: privateMethod
    };
})();