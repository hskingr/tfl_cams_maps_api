import express from "express";
import "dotenv/config";
import { MongoClient } from "mongodb";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());
const port = 3200;
app.listen(port);

const url = process.env.MONGOOSE_CONNECTION_STRING;
const client = new MongoClient(url);
const dbName = "TflCams";

async function queryDatabase({ southWest, northEast }) {
  try {
    await client.connect();
    console.log("Connected successfully to server");
    const db = client.db(dbName);
    const collection = db.collection("TflCams");
    const findResult = await collection
      .aggregate([
        {
          $match: {
            location: {
              $geoWithin: {
                $box: [
                  [
                    parseFloat(JSON.parse(southWest).long),
                    parseFloat(JSON.parse(southWest).lat),
                  ],
                  [
                    parseFloat(JSON.parse(northEast).long),
                    parseFloat(JSON.parse(northEast).lat),
                  ],
                ],
              },
            },
          },
        },
        { $limit: 50 },
      ])
      .toArray();
    return findResult;
  } catch (error) {
    console.log(error);
  }
}

app.get("/getBounds", async (req, res) => {
  try {
    console.log(req.query);
    const result = await queryDatabase(req.query);
    console.log(result);
    await res.send(result);
  } catch (error) {
    console.log(error);
  }
});
