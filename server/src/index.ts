import express, { Request, Response } from "express";
import multer from "multer";
import path from "path";
import { cloudinary } from "./cloudinary/Cloudinary";
import cors from "cors";
import bodyParser from "body-parser";
import { CloudinaryStorage } from "multer-storage-cloudinary";

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

//cloudinary storage
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,

})

// Set multer Storage Engine
const storage = multer.diskStorage({
  destination: (req: Request, file, cb) => {
    cb(null, "Images");
  },
  filename: (req: Request, file, cb) => {
    console.log(file);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
//multer upload
const upload = multer({ storage: storage });

//fetching all the uploads from cloudinary controller
const getposts = async (req: Request, res: Response) => {
  try {
    const { resources } = await cloudinary.search
      .expression("folder:samples")
      .sort_by("public_id", "desc")
      .max_results(30)
      .execute();
    const publicIds = resources.map((file: any) => file.public_id);
    console.log(publicIds);
    res.send(publicIds);
  } catch (error) {
    console.log("error fetching posts", error);
  }
};

//posting to cloudinary controller
const posting = async (req: Request, res: Response) => {
  try {
    const result = await cloudinary.uploader.upload(
      "http://t0.gstatic.com/licensed-image?q=tbn:ANd9GcSULofuHPrn8WKiDotpGvagtZStVAO62DSqfKyykCnoQQ50h-EU3NQ1zZ5XF-n3317Ao9aonYeiuK3Kn90"
    );
    console.log("result", result);
  } catch (error) {
    console.log("error uploading file", error);
  }
};

//fetching all the uploads from cloudinary route
app.get("/", getposts);

//posting to cloudinary route
app.post("/cloud", posting);


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
