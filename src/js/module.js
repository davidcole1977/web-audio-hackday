module.exports = (function () {

  console.log('loaded module');

  function Arithmetic () {

  }

  Arithmetic.prototype.sum  = function (a, b) {
    return a + b;
  };

  return {
    Arithmetic: Arithmetic
  };

})();
