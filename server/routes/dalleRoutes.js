import express from "express";
import * as dotenv from "dotenv";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

const router = express.Router();

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

router.route("/").get((req, res) => {
	res.status(200).json({ message: "Hello from DALL-E!" });
});

router.route("/").post(async (req, res) => {
	try {
		const { prompt } = req.body;

		const aiResponse = await openai.createImage({
			prompt,
			n: 4,
			size: "1024x1024",
			// response_format: "b64_json",
			response_format: "url",
		});

		aiResponse.data.data.map((e) => console.log(e.url));
		// console.log(
		// 	"I am inside of generating image from dalle" +
		// 		aiResponse.data.data.url +
		// 		"I am inside of generating image from dalle" +
		// 		aiResponse.data.data[0].b64_json
		// );
		// const image = aiResponse.data.data[0].b64_json;
		// const image = aiResponse.data.data[0].url;
		const images = aiResponse.data;
		res.status(200).json({ photos: images });
	} catch (error) {
		console.error(error);
		res
			.status(500)
			.send(error?.response.data.error.message || "Something went wrong");
	}
});

export default router;
