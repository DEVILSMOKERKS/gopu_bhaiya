const multer = require('multer');
const path = require("path");
const fs = require("fs");

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

    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, uploadDir);
      },
      filename: (req, file, cb) => {
        const originalName = file.originalname;
        const targetPath = path.join(uploadDir, originalName);

        // ❌ Reject if file with same name exists
        if (fs.existsSync(targetPath)) {
          cb(new Error(`Image already exists: ${originalName}`));
        } else {
          cb(null, originalName);
        }
      }
    });

    const multerMiddleware = multer({ storage }).single(fieldName);

    return [addCorsHeaders, (req, res, next) => {
      multerMiddleware(req, res, (err) => {
        if (err) {
          return res.status(409).json({ error: err.message });
        }
        next();
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
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, uploadDir);
      },
      filename: (req, file, cb) => {
        const originalName = file.originalname;
        const targetPath = path.join(uploadDir, originalName);
        if (fs.existsSync(targetPath)) {
          cb(new Error(`Image already exists: ${originalName}`));
        } else {
          cb(null, originalName);
        }
      }
    });
    const multerMiddleware = multer({ storage }).array(fieldName, maxCount);
    return [addCorsHeaders, (req, res, next) => {
      multerMiddleware(req, res, (err) => {
        if (err) {
          return res.status(409).json({ error: err.message });
        }
        next();
      });
    }];
  }
};

module.exports = { upload };

