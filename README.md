replicable-content-addressable-store
====================================

Replicable content addressable store built on top of leveldb.

Usage
-----

```js
var rcas = require('replicable-content-addressable-store');

var store = rcas(db, {id: 'some-node-id'}); // db is a levelup instance
store.put('hello world', function(err, key) {
});

// to replicate
var s1 = store.syncStream();
var s2 = otherStore.syncStream();
s1.pipe(s2).pipe(s1);
```

API
---

#### var store = rcas(db, [opts]);

`db` is a [levelup](https://github.com/rvagg/node-levelup) instance.
`opts` can be

  id - The id for the replication log.

#### store.put(value, [cb])

Puts a value on the store and calls the callback with the error and the assigned key.

#### store.get(key, cb)

Gets a value given a key

#### store.del(key, cb)

Deletes the value from the store.

#### store.syncStream()

Returns a duplex stream to do replication with another replicable-content-addressable-store instance.

#### store.createReadStream([opts])

Returns an object readable stream of the key value pairs in the store. Same options as levelup.

#### store.createKeyStream([opts])

Returns an object readable stream of the keys in the store. Same options as levelup.

#### store.createValueStream([opts])

Returns an object readable stream of the values in the store. Same options as levelup.

License
-------

MIT
