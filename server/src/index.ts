import express, { Request, Response } from "express";
import multer from "multer";
import path from "path";
import { cloudinary } from "./cloudinary/Cloudinary";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();

// initialize ejs
app.set("view engine", "ejs");

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

const posting = async (req: Request, res: Response) => {
  console.log("req.body", req.body.data);
  try {
    const result = await cloudinary.uploader.upload(
      "http://t0.gstatic.com/licensed-image?q=tbn:ANd9GcSULofuHPrn8WKiDotpGvagtZStVAO62DSqfKyykCnoQQ50h-EU3NQ1zZ5XF-n3317Ao9aonYeiuK3Kn90"
    );
    console.log("result", result);
  } catch (error) {
    console.log("error uploading file", error);
  }
};

app.post("/cloud", posting);

// Set Storage Engine
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

//multer GET route
app.get("/upload", (req: Request, res: Response) => {
  res.render("upload");
});

//multer POST route
app.post("/upload", upload.single("image"), (req: Request, res: Response) => {
  res.send("image uploaded");
});

// server port
const port = 5000;

// server listen
app.listen(port, () => console.log(`Server running on port ${port}`));
