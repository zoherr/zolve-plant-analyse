import { GoogleGenerativeAI } from "@google/generative-ai";
import * as fs from 'node:fs';

export const analyse = async (req, res, next) => {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Image file is missing. Please upload a valid image."
            });
        }

        const uploadedImagePath = req.file.path;


        function fileToGenerativePart(path, mimeType) {
            return {
                inlineData: {
                    data: Buffer.from(fs.readFileSync(path)).toString("base64"),
                    mimeType,
                },
            };
        }
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = "Please examine this plant image and provide a detailed evaluation. Identify the species, assess its health status, and suggest appropriate care guidelines. Include information on its distinguishing features, specific care needs, and any fascinating facts related to the plant. Present the response clearly in plain text without using any formatting or special characters."

        const imagePart = fileToGenerativePart(uploadedImagePath, "image/png");

        const result = await model.generateContent([prompt, imagePart]);

        if (!result) {
            return res.status(400).json({
                success: false,
                message: "An error occurred while retrieving data from the API."
            });
        }
        const plantAnalysisResult = result.response.text();
        await fs.promises.unlink(uploadedImagePath);

        res.status(200).json({
            success: true,
            plantAnalysisResult,
        });
    } catch (error) {
        console.error("Error analyzing plant image:", error);
        next(error);
    }
};
