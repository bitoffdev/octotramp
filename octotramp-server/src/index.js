const express = require("express");

const model = require("./model");

const app = express();
const port = 3000;

app.use(express.static("../octotramp-client/dist"));

app.get("/leaderboard", async (req, res) => {
  const { name, score } = req.query;
  if (name && score) {
    await model.recordScore(name, score);
  }
  const leaderboard = await model.listScores();
  res.json({
    leaders: leaderboard.map((row) => ({ name: row.name, score: row.score })),
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
