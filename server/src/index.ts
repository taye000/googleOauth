import express, { Request, Response } from "express";
import multer from "multer";
import path from "path";

const app = express();

const storage = multer.diskStorage({
  destination: (req: Request, file, cb) => {
    cb(null, "Images");
  },
  filename: (req: Request, file, cb) => {
    console.log(file);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Set Storage Engine
app.set("view engine", "ejs");

app.get("/upload", (req: Request, res: Response) => {
  res.render("upload");
});

app.post("/upload", upload.single("image"), (req: Request, res: Response) => {
  res.send("image uploaded");
});

const port = 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
