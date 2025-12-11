const controller = require("../controllers/productController");

function callController(fn, req) {
  return new Promise((resolve) => {
    const res = {
      _status: 200,
      status(code) { this._status = code; return this; },
      json(data) { resolve({ status: this._status || 200, data }); },
      send(data) { resolve({ status: this._status || 200, data }); }
    };
    try {
      const r = fn(req, res);
      // In case controller returns a promise
      if (r && typeof r.then === 'function') {
        r.then(() => {}).catch(() => {});
      }
    } catch (err) {
      resolve({ status: 500, data: { error: String(err) } });
    }
  });
}

(async function run() {
  console.log('--- Initial list ---');
  console.log(await callController(controller.getAll, { }));

  console.log('\n--- Create product ---');
  const createRes = await callController(controller.add, { body: { name: 'Auto Test Product', price: 99999, image: 'https://via.placeholder.com/150' } });
  console.log(createRes);

  const newId = createRes.data && createRes.data.id;
  if (!newId) {
    console.error('Failed to create product, aborting tests.');
    process.exit(1);
  }

  console.log('\n--- After create (list) ---');
  console.log(await callController(controller.getAll, {}));

  console.log('\n--- Update product ---');
  console.log(await callController(controller.update, { params: { id: String(newId) }, body: { name: 'Updated Test Product', price: 11111, image: 'https://via.placeholder.com/150' } }));

  console.log('\n--- After update (list) ---');
  console.log(await callController(controller.getAll, {}));

  console.log('\n--- Delete product ---');
  console.log(await callController(controller.delete, { params: { id: String(newId) } }));

  console.log('\n--- Final list ---');
  console.log(await callController(controller.getAll, {}));
})();
