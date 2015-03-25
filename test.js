var level = require('level-test')();
var test = require('tape');
var cas = require('./');

test('basic test', function(t) {
  var store = cas(level('cas'), {id: 'cas1'});
  var store2 = cas(level('cas2'), {id: 'cas2'});

  var s1 = store.syncStream();
  var s2 = store2.syncStream();

  s1.pipe(s2).pipe(s1);

  t.plan(6);
  store.put('hello world', function(err, key) {
    t.notOk(err);
    t.equal(key, 'uU0nuZNNPgilLlLX2n2r+sSE7+N6U4DukIj3rOLvzek=');
    setTimeout(function() {
      store.get('uU0nuZNNPgilLlLX2n2r+sSE7+N6U4DukIj3rOLvzek=', function(err, val) {
        t.notOk(err);
        t.equal(val, 'hello world');
      });

      store2.get('uU0nuZNNPgilLlLX2n2r+sSE7+N6U4DukIj3rOLvzek=', function(err, val) {
        t.notOk(err);
        t.equal(val, 'hello world');
      });
    }, 200);
  });
});
