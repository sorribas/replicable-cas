var level = require('level-test')();
var test = require('tape');
var cas = require('./');
var afterAll = require('after-all');
var concat = require('concat-stream');

test('basic replication', function(t) {
  var store = cas(level('cas'), {id: 'cas1'});
  var store2 = cas(level('cas2'), {id: 'cas2'});

  var s1 = store.syncStream();
  var s2 = store2.syncStream();

  s1.pipe(s2).pipe(s1);

  t.plan(14);

  var onput = function(err, key) {
    t.notOk(err);
    store2.del('b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9', function(err) {
      t.notOk(err);
      store2.get('b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9', function(err, val) {
        t.ok(err && err.notFound);
        t.notOk(val);
      });

      setTimeout(function() {
        store.get('b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9', function(err, val) {
          t.ok(err && err.notFound);
          t.notOk(val);
        });

        store.get('0b894166d3336435c800bea36ff21b29eaa801a52f584c006c49289a0dcf6e2f', function(err, val) {
          t.notOk(err);
          t.equal(val, 'hola mundo');
        })
      }, 200);
    });
  };

  store.put('hello world', function(err, key) {
    t.notOk(err);
    t.equal(key, 'b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9');
    store.get('b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9', function(err, val) {
      t.notOk(err);
      t.equal(val, 'hello world');
    });
    setTimeout(function() {
      store2.get('b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9', function(err, val) {
        t.notOk(err);
        t.equal(val, 'hello world');
        store2.put('hola mundo', onput)
      });
    }, 200);
  });
});

test('streams', function(t) {
  var store = cas(level('cas-streams'));
  t.plan(3);

  var next = afterAll(function() {
    store.createReadStream().pipe(concat({encoding: 'object'}, function(objs) {
      t.equal(objs.length, 5);
    }));

    store.createValueStream().pipe(concat({encoding: 'object'}, function(objs) {
      t.equal(objs.length, 5);
    }));

    store.createKeyStream().pipe(concat({encoding: 'object'}, function(objs) {
      t.equal(objs.length, 5);
    }));
  });

  store.put('hello world', next());
  store.put('hola mundo', next());
  store.put('hej verden', next());
  store.put('hello world', next());
  store.put('Olá mundo', next());
});
