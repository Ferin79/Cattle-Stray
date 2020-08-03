const vision = require("@google-cloud/vision");

exports.animalDetection = async (req, res, next) => {
  try {
    const { imageUrl } = req.body;

    const client = new vision.ImageAnnotatorClient({
      keyFilename: "google-vision.json",
    });

    const [result] = await client.labelDetection(imageUrl);
    const labels = result.labelAnnotations;

    const [testResult] = await client.textDetection(imageUrl);
    const detections = testResult.textAnnotations;

    const [multipleObj] = await client.objectLocalization(imageUrl);
    const objects = multipleObj.localizedObjectAnnotations;

    const obj = [];
    objects.forEach((object) => {
      obj.push({
        label: object.name,
        confidence: object.score,
      });
    });

    const texts = [];
    detections.forEach((text) => texts.push(text.description));

    const data = [];
    labels.forEach((label) => {
      data.push(label.description);
    });

    res.status(200).json({
      success: true,
      labels: data,
      texts,
      obj,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
