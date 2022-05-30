const polk = require("polka");
const { MongoClient } = require("mongodb");

polk()
  .get("/create", (req, res) => {
    const cl = new MongoClient("mongodb://localhost:27017");
    async function run() {
      try {
        await cl.connect();
        const dbs = cl.db("intro");
        const coll = dbs.collection("quotes");

        const rest = await coll.insertOne({ quote: "This is my quote." });
        res.end(JSON.stringify(rest));
      } catch (ex) {
        console.log("Error: " + ex);
      } finally {
        await cl.close();
      }
    }
    run().catch(console.dir);
  })
  .get("/retrieve", (req, res) => {
    const cl = new MongoClient("mongodb://localhost:27017");
    async function run() {
      try {
        await cl.connect();
        const dbs = cl.db("intro");
        const coll = dbs.collection("quotes");

        const cur = coll.find({}, {});

        let items = [];
        await cur.forEach(function (doc) {
          items.push(doc);
        });
        res.end(JSON.stringify(items));
      } catch (err) {
        console.warn("ERROR: " + err);
        if (errCallback) errCallback(err);
      } finally {
        await cl.close();
      }
    }
    run().catch(console.dir);
  })
  .get("/update", (req, res) => {
    const cl = new MongoClient("mongodb://localhost:27017");
    async function run() {
      try {
        await cl.connect();
        const dbs = cl.db("intro");
        const coll = dbs.collection("quotes");

        const updateDocument = {
          $set: {
            author: "Martin Kings",
          },
        };

        const rst = await coll.updateOne({}, updateDocument, {});
        res.end("Updated: " + rst.modifiedCount);
      } catch (ex) {
        errCallback(ex);
      } finally {
        await cl.close();
      }
    }
    run().catch(console.dir);
  })
  .get("/delete", (req, res) => {
    const cl = new MongoClient("mongodb://localhost:27017");
    async function run() {
      try {
        await cl.connect();
        const dbs = cl.db("intro");
        const coll = dbs.collection("quotes");
        const qry = {};
        const rst = await coll.deleteOne(qry);
        if (rst.deletedCount === 1) {
          res.end("One document deleted.");
        } else {
          res.end("No document was deleted.");
        }
      } finally {
        await cl.close();
      }
    }
  })
  .listen(3000, (err) => {
    if (err) throw err;
    console.log(`> localhost:3000`);
  });
