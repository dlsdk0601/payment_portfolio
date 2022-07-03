import express from "express";
import path from "path";

// exporess
const app = express();

const __dirname = path.resolve();
const port = process.env.PORT || 5000;

// 미들웨어 함수를 특정 경로에 등록
app.use("/test", function (req, res) {
  res.json({ greeting: "Hello World" });
});

app.listen(port);

app.use(express.static(path.join(__dirname, "/client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

console.log("start good");
console.log("deploy test8");
