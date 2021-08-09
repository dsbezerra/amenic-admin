const { getUploadedImages } = require('./cloudinary');

const testGetUploadedImages = async () => {
  const result = await getUploadedImages();
  console.log(result);
};

testGetUploadedImages();
