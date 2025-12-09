const multer = require('multer');
const path = require("path");
const fs = require("fs");
const sharp = require('sharp');

// ✅ Allowed folders only (must match exactly)
const allowedFolders = ["blogs", "profile", "products", "categories", "subcategories", "reviews"];

// 🔍 Validate folder name (after cleanup)
const isValidFolder = (folderPath) => {
  const cleanFolder = folderPath.replace("/", "");
  return allowedFolders.includes(cleanFolder);
};

// CORS headers function
const addCorsHeaders = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
};

const upload = {
  single: (fieldName, folderPath) => {
    if (!folderPath || !folderPath.startsWith("/")) {
      throw new Error("Folder path must start with '/'");
    }

    let cleanFolder = folderPath.replace("/", "");

    // ✅ If folder is in allowedFolders, auto-create if not exists
    if (!isValidFolder("/" + cleanFolder)) {
      return (req, res, next) => {
        return res.status(400).json({
          error: `Invalid folder '${cleanFolder}'. Allowed: ${allowedFolders.join(", ")}`
        });
      };
    }

    // Auto-create any allowed folder if not exists
    const uploadDir = path.join("public", cleanFolder);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const storage = multer.memoryStorage();

    const multerMiddleware = multer({ 
      storage: storage,
      fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (allowedTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error('Only image files are allowed (JPEG, PNG, WebP)'));
        }
      }
    }).single(fieldName);

    return [addCorsHeaders, (req, res, next) => {
      multerMiddleware(req, res, async (err) => {
        if (err) {
          return res.status(409).json({ error: err.message });
        }

        if (req.file) {
          try {
            const originalName = req.file.originalname;
            const nameWithoutExt = path.parse(originalName).name;
            const ext = path.parse(originalName).ext.toLowerCase();
            const timestamp = Date.now();
            const filename = `${nameWithoutExt}-${timestamp}${ext}`;
            const filePath = path.join(uploadDir, filename);

            if (fs.existsSync(filePath)) {
              return res.status(409).json({ error: `Image already exists: ${filename}` });
            }

            await sharp(req.file.buffer)
              .toFormat(ext === '.jpg' || ext === '.jpeg' ? 'jpeg' : ext === '.png' ? 'png' : 'webp')
              .toFile(filePath);

            req.file.filename = filename;
            req.file.path = filePath;
            next();
          } catch (sharpError) {
            console.error('Sharp processing error:', sharpError);
            return res.status(500).json({ error: 'Error processing image' });
          }
        } else {
          next();
        }
      });
    }];
  },
  array: (fieldName, maxCount, folderPath) => {
    if (!folderPath || !folderPath.startsWith("/")) {
      throw new Error("Folder path must start with '/'");
    }
    let cleanFolder = folderPath.replace("/", "");
    if (!isValidFolder("/" + cleanFolder)) {
      return (req, res, next) => {
        return res.status(400).json({
          error: `Invalid folder '${cleanFolder}'. Allowed: ${allowedFolders.join(", ")}`
        });
      };
    }
    const uploadDir = path.join("public", cleanFolder);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const storage = multer.memoryStorage();

    const multerMiddleware = multer({ 
      storage: storage,
      fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (allowedTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error('Only image files are allowed (JPEG, PNG, WebP)'));
        }
      }
    }).array(fieldName, maxCount);

    return [addCorsHeaders, (req, res, next) => {
      multerMiddleware(req, res, async (err) => {
        if (err) {
          return res.status(409).json({ error: err.message });
        }

        if (req.files && req.files.length > 0) {
          try {
            const processedFiles = [];
            for (const file of req.files) {
              const originalName = file.originalname;
              const nameWithoutExt = path.parse(originalName).name;
              const ext = path.parse(originalName).ext.toLowerCase();
              const timestamp = Date.now();
              const randomStr = Math.random().toString(36).substring(2, 8);
              const filename = `${nameWithoutExt}-${timestamp}-${randomStr}${ext}`;
              const filePath = path.join(uploadDir, filename);

              if (fs.existsSync(filePath)) {
                continue;
              }

              await sharp(file.buffer)
                .toFormat(ext === '.jpg' || ext === '.jpeg' ? 'jpeg' : ext === '.png' ? 'png' : 'webp')
                .toFile(filePath);

              processedFiles.push({
                ...file,
                filename: filename,
                path: filePath
              });
            }
            req.files = processedFiles;
            next();
          } catch (sharpError) {
            console.error('Sharp processing error:', sharpError);
            return res.status(500).json({ error: 'Error processing images' });
          }
        } else {
          next();
        }
      });
    }];
  }
};

module.exports = { upload };

