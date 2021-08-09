const cloudinary = require('cloudinary');
const generate = require('nanoid/generate');
const { contains } = require('../../utils/string');

const CLOUD_NAME = 'dyrib46is';

// TODO(diego): Remove quality path once we implement multiple quality upload
const IMAGE_POSTER = 'amenic/p/mq';
const IMAGE_BACKDROP = 'amenic/b/mq';

const IMAGE_NAME_CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const IMAGE_NAME_LENGTH = 27;

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: '649342348956991',
  api_secret: 'KunmyL9eIQH_HU-2BqhByPR3nYs',
});

const getPublicIdFromUri = (uri) => {
  // NOTE(diego): All images must be uploaded to amenic folder.
  const start = uri.indexOf('amenic');
  if (start < 0) {
    return null;
  }
  const end = uri.lastIndexOf('.');
  if (end < 0) {
    return null;
  }
  return uri.substring(start, end);
};

const destroy = async (publicId, options) => (
  cloudinary.v2.uploader.destroy(publicId, options)
);

const destroyFromUri = async (uri, options) => (
  destroy(getPublicIdFromUri(uri, options))
);

const getUploadedImages = async () => {
  try {
    const { resources } = await cloudinary.v2.api.resources({ type: 'upload', max_results: 500 });
    return resources;
  } catch (err) {
    console.log(err);
    return [];
  }
};

/**
 * Renames a image.
 * @param {string} fromPublicId Old name
 * @param {string} toPublicId New name
 */
const rename = async (fromPublicId, toPublicId) => {
  // See:
  // https://cloudinary.com/documentation/node_image_upload#rename_images
  const defaultOptions = {
    overwrite: true,
  };
  const result = await cloudinary.v2.uploader.rename(fromPublicId, toPublicId, defaultOptions);
  return result;
};

const upload = async (uri, options) => {
  if (!uri) {
    throw new Error('Invalid URI.');
  }

  let finalOpts = options;
  if (!finalOpts) {
    finalOpts = {
      use_filename: true,
    };
  }

  const result = await cloudinary.v2.uploader.upload(uri, finalOpts);
  return result;
};

/**
 * Uploads a backdrop image
 * @param {string} uri Image path or url
 * @param {string} options Cloudinary options
 */
const uploadBackdrop = async (uri, options) => {
  let finalOptions = options;
  if (!finalOptions) {
    finalOptions = {
      crop: 'fill',
      width: 1400,
      height: 450,
      format: 'jpg',
    };
  }
  const id = generate(IMAGE_NAME_CHARS, IMAGE_NAME_LENGTH);
  finalOptions.public_id = `${IMAGE_BACKDROP}/${id}`;
  return upload(uri, finalOptions);
};

/**
 * Uploads a poster image
 * @param {string} uri Image path or url
 * @param {string} options Cloudinary options
 */
const uploadPoster = async (uri, options) => {
  let finalOptions = options;
  if (!finalOptions) {
    finalOptions = {
      crop: 'scale',
      width: 300,
      height: 450,
      format: 'jpg',
    };
  }
  // TODO(diego): Create other quality images here.
  const id = generate(IMAGE_NAME_CHARS, IMAGE_NAME_LENGTH);
  finalOptions.public_id = `${IMAGE_POSTER}/${id}`;
  return upload(uri, finalOptions);
};

/**
 * Checks if a given image uri matches the used cloud-name for this app.
 * @param {string} uri Uri of image
 */
const matchesCloudName = uri => (
  uri !== undefined && uri != null && contains(uri, `res.cloudinary.com/${CLOUD_NAME}`)
);

const getImageName = (uri) => {
  let start = uri.lastIndexOf('/');
  const end = uri.lastIndexOf('.');
  if (start > -1) {
    start += 1;
    if (end > -1) {
      return uri.substring(start, end);
    }

    return uri.substring(start);
  }

  return uri;
};

module.exports = {
  getPublicIdFromUri,
  getUploadedImages,
  destroy,
  destroyFromUri,
  rename,
  upload,
  uploadBackdrop,
  uploadPoster,
  matchesCloudName,
  getImageName,
};
