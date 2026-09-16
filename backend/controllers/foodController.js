import foodModel from "../models/foodModel.js";
import { put, del } from "@vercel/blob";

// add food
const addFood = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Image is required"
            });
        }

        const safeFileName = req.file.originalname
            .replace(/[^a-zA-Z0-9._-]/g, "_");

        const blob = await put(
            `foods/${safeFileName}`,
            req.file.buffer,
            {
                access: "public",
                addRandomSuffix: true
            }
        );

        const food = new foodModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            image: blob.url
        });

        await food.save();

        res.json({
            success: true,
            message: "Food Added"
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Error adding food"
        });
    }
};

// all food list
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({});

        res.json({
            success: true,
            data: foods
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Error"
        });
    }
};

// remove food
const removeFood = async (req, res) => {
    try {
        const food = await foodModel.findById(req.body.id);

        if (!food) {
            return res.status(404).json({
                success: false,
                message: "Food not found"
            });
        }

        // Ảnh mới trên Vercel Blob
        if (
            food.image &&
            food.image.startsWith("http") &&
            food.image.includes("blob.vercel-storage.com")
        ) {
            await del(food.image);
        }

        await foodModel.findByIdAndDelete(req.body.id);

        res.json({
            success: true,
            message: "Food Removed"
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Error removing food"
        });
    }
};

export {
    addFood,
    listFood,
    removeFood
};