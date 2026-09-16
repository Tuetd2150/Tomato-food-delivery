import express from "express";
import {
    addFood,
    listFood,
    removeFood
} from "../controllers/foodController.js";

import multer from "multer";

const foodRouter = express.Router();

// Giữ ảnh trong RAM, không ghi vào backend/uploads
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: {
        fileSize: 3 * 1024 * 1024 // tối đa 3 MB
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed"));
        }
    }
});

foodRouter.get("/list", listFood);
foodRouter.post("/add", upload.single("image"), addFood);
foodRouter.post("/remove", removeFood);

export default foodRouter;