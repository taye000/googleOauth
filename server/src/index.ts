import express, { Request, Response } from "express";
import multer from "multer";
import { cloudinary } from "./cloudinary/Cloudinary";
import cors from "cors";
import bodyParser from "body-parser";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import path from "path";

const app = express();

// initialize ejs
app.set("view engine", "ejs");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

//cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
});

// Set multer Storage Engine
const multerStorage = multer.diskStorage({
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
const multerUpload = multer({ storage: multerStorage });

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

//fetching all the uploads from cloudinary route
app.get("/", getposts);

//pure cloudinary route
const uploadImage = async (req: Request, res: Response) => {
  const imagePath = req.file?.path;
  try {
    const result = await cloudinary.uploader.upload(imagePath!, {
      folder: "samples",
    });
    const imageURL = result.secure_url;

    res.status(201).json({success: true, message: "image uploaded to cloudinary", imageURL  });
    return result;
  } catch (error) {
    res.status(500).json({success: false, message: "error uploading image", response: error  });
    console.log("error uploading image", error);
  }
};
app.post("/cloudinary", upload.single("image"), uploadImage);

//multer GET route
app.get("/upload", (req: Request, res: Response) => {
  res.render("upload");
});

//multer POST route
app.post(
  "/upload",
  multerUpload.single("image"),
  (req: Request, res: Response) => {
    res.send("image uploaded to local storage");
  }
);

// server port
const port = 5000;

// server listen
app.listen(port, () => console.log(`Server running on port ${port}`));
