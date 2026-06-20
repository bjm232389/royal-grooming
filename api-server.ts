import express from "express";
import path from "path";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || "3000", 10);

// Allow requests from Cloudflare Pages (any domain) and local dev
app.use(cors({
  origin: true,
  credentials: true,
}));

// Internal logger for diagnosis
const LOG_FILE = path.join(process.cwd(), "server_requests.log");
function writeLog(message: string) {
  try {
    const timestamp = new Date().toISOString();
    fs.appendFileSync(LOG_FILE, `[${timestamp}] ${message}\n`);
    console.log(message);
  } catch (err) {
    console.error("Failed to write to log file", err);
  }
}

writeLog(`API Server starting... PORT: ${PORT}`);

// Path to JSON-based dynamic database
const PRODUCTS_DB_PATH = path.join(process.cwd(), "products.json");

// Define product interface
interface DatabaseProduct {
  id: string;
  name: string;
  category: "beard" | "hair" | "tools" | "wholesale";
  priceRetail: number;
  priceWholesaleMin: number;
  minWholesaleQty: number;
  wholesaleUnitDesc: string;
  description: string;
  features: string[];
  rating: number;
  featured: boolean;
  inStock: boolean;
  imageUrl?: string;
  media_url?: string;
  media_type?: "image" | "video";
  illustrationType: "oil" | "balm" | "pomade" | "spray" | "razor" | "comb" | "clipper" | "pack";
}

// Default Seed Products
const SEED_PRODUCTS: DatabaseProduct[] = [
  {
    id: "pr-01",
    name: "Royal Beard Oil Premium",
    category: "beard",
    priceRetail: 1250,
    priceWholesaleMin: 750,
    minWholesaleQty: 6,
    wholesaleUnitDesc: "Mínimo 6 un.",
    description: "Elixir nutritivo premium para barba con infusión de aceite de argán, jojoba pura y cedro canadiense.",
    features: ["Brillo elegante no graso", "Aroma masculino a madera de cedro", "Estimula el vello saludable"],
    rating: 4.9,
    featured: true,
    inStock: true,
    illustrationType: "oil"
  },
  {
    id: "pr-02",
    name: "Lion Sculpting Beard Balm",
    category: "beard",
    priceRetail: 950,
    priceWholesaleMin: 580,
    minWholesaleQty: 6,
    wholesaleUnitDesc: "Mínimo 6 un.",
    description: "Bálsamo modelador de fijación media-suave formulado con manteca de karité y cera de abejas.",
    features: ["Fijación media de larga duración", "Elimina el frizz", "Aroma cítrico noble"],
    rating: 4.8,
    featured: true,
    inStock: true,
    illustrationType: "balm"
  },
  {
    id: "pr-03",
    name: "Imperial Matte Clay Pomade",
    category: "hair",
    priceRetail: 1100,
    priceWholesaleMin: 650,
    minWholesaleQty: 12,
    wholesaleUnitDesc: "Mínimo 12 un.",
    description: "Cera de arcilla premium con base de agua para una fijación extrema de acabado mate impecable.",
    features: ["Acabado 100% mate", "Fijación extrema", "Fácil remoción"],
    rating: 5.0,
    featured: true,
    inStock: true,
    illustrationType: "pomade"
  },
  {
    id: "pr-05",
    name: "Carbon Fiber Luxury Shaving Razor v2",
    category: "tools",
    priceRetail: 2100,
    priceWholesaleMin: 1350,
    minWholesaleQty: 4,
    wholesaleUnitDesc: "Mínimo 4 un.",
    description: "Navaja de afeitar profesional construida en fibra de carbono genuina ultra-ligera.",
    features: ["Distribución de peso equilibrada", "Cambio rápido de hoja", "Cabezal premium"],
    rating: 4.9,
    featured: true,
    inStock: true,
    illustrationType: "razor"
  },
  {
    id: "pr-07",
    name: "Royal Gold Clipper (León Edición Especial)",
    category: "tools",
    priceRetail: 4800,
    priceWholesaleMin: 3200,
    minWholesaleQty: 3,
    wholesaleUnitDesc: "Mínimo 3 un.",
    description: "Máquina recortadora profesional inalámbrica en chasis totalmente metálico dorado.",
    features: ["Batería 200 min", "Isotipo león grabado", "Corte zero-gap"],
    rating: 5.0,
    featured: true,
    inStock: true,
    illustrationType: "clipper"
  },
  {
    id: "pr-08",
    name: "Super Pack Reseller Barbero 20x",
    category: "wholesale",
    priceRetail: 22000,
    priceWholesaleMin: 14000,
    minWholesaleQty: 1,
    wholesaleUnitDesc: "1 Unidad de Pack",
    description: "Lote mayorista exclusivo de máximo ahorro que incluye pomadas, aceites de barba y material promocional.",
    features: ["Ahorro del 45%", "Material promocional incluido", "Asesoría de ventas"],
    rating: 5.0,
    featured: true,
    inStock: true,
    illustrationType: "pack"
  }
];

// Helper to load products from local JSON file (acts as our SQLite / Supabase PostgreSQL fallback)
function getProductsFromDb(): DatabaseProduct[] {
  if (!fs.existsSync(PRODUCTS_DB_PATH)) {
    fs.writeFileSync(PRODUCTS_DB_PATH, JSON.stringify(SEED_PRODUCTS, null, 2));
    return SEED_PRODUCTS;
  }
  try {
    const data = fs.readFileSync(PRODUCTS_DB_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to parse products database file", error);
    return SEED_PRODUCTS;
  }
}

// Helper to save products to local JSON file
function saveProductsToDb(products: DatabaseProduct[]) {
  try {
    fs.writeFileSync(PRODUCTS_DB_PATH, JSON.stringify(products, null, 2));
  } catch (error) {
    console.error("Failed to write to products database file", error);
  }
}

// Ensure local uploads directory exists for fallback simulation when Cloudinary key is missing
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Config Multer storage (we store files in memory to either push directly to Cloudinary or write to public upload folder fallback)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Lazy Cloudinary Initializer
let isCloudinaryConfigured = false;
function initCloudinary() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (cloudName && apiKey && apiSecret) {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });
    isCloudinaryConfigured = true;
    console.log("Cloudinary initialized successfully!");
  } else {
    isCloudinaryConfigured = false;
    console.log("Cloudinary credentials missing. Defaulting to local public upload simulation.");
  }
}

// Make sure to parse requests properly
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log each request
app.use((req, res, next) => {
  writeLog(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// Serve public uploads statically
app.use("/uploads", express.static(UPLOADS_DIR));

// GET API: Retrieve all products
app.get("/api/products", (req, res) => {
  try {
    const categoryQuery = req.query.category as string;
    let products = getProductsFromDb();

    // Order by newest first by reversing or handling custom index
    products = [...products].reverse();

    if (categoryQuery && categoryQuery !== "all") {
      products = products.filter(
        (p) => p.category.toLowerCase() === categoryQuery.toLowerCase()
      );
    }

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Fallo al consultar el catálogo de productos.",
      error: error.message,
    });
  }
});

// POST API: Add a new premium product to catalog (With file uploads to Cloudinary or simulation)
app.post("/api/products", upload.single("media"), async (req, res, next) => {
  try {
    writeLog(`POST /api/products request received. Body keys: ${Object.keys(req.body || {}).join(", ")}, Has file: ${!!req.file}`);

    // 1. Password/Token Authentication Protection as requested:
    const authHeader = req.headers.authorization;
    const rawSecret = process.env.ADMIN_SECRET_TOKEN || "royal_admin_secret_token";
    // Normalize token by removing wrapping quotes if any
    const expectedToken = rawSecret.replace(/^["']|["']$/g, "").trim();
    
    // Support comparing standard Bearer token or direct token
    const tokenPart = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;

    if (!tokenPart || tokenPart.trim() !== expectedToken) {
      writeLog(`Authentication failed. Raw Secret: "${rawSecret}", Received Token Part: "${tokenPart || "none"}"`);
      return res.status(401).json({
        success: false,
        message: `No autorizado. El token administrativo ingresado es inválido o no coincide con la configuración del servidor. Use "${expectedToken}" por defecto.`,
      });
    }

    // Extract product details from multipart body
    const {
      name,
      priceRetail,
      priceWholesaleMin,
      minWholesaleQty,
      wholesaleUnitDesc,
      description,
      category,
      features, // Expecting comma separated string or array
      illustrationType,
    } = req.body;

    // Validate fundamental fields
    if (!name || !priceRetail || !category) {
      writeLog(`Validation failed. Name: ${name}, PriceRetail: ${priceRetail}, Category: ${category}`);
      return res.status(400).json({
        success: false,
        message: "Por favor provea el nombre, precio al detalle y categoría del producto.",
      });
    }

    const file = req.file;
    let finalMediaUrl = "";
    let mediaType: "image" | "video" = "image";

    // 2. File size & Media upload processing
    if (file) {
      const isVideo = file.mimetype.startsWith("video/");
      mediaType = isVideo ? "video" : "image";

      // File Size Strict constraints validation: Image <= 2MB, Video <= 10MB
      const sizeInMB = file.size / (1024 * 1024);
      writeLog(`Processing uploaded file: ${file.originalname} (${sizeInMB.toFixed(2)} MB), Type: ${file.mimetype}`);

      if (isVideo) {
        if (sizeInMB > 10) {
          return res.status(400).json({
            success: false,
            message: "El video demostrativo supera el límite estricto de 10 MB.",
          });
        }
      } else {
        if (sizeInMB > 2) {
          return res.status(400).json({
            success: false,
            message: "La imagen de catálogo supera el límite estricto de 2 MB.",
          });
        }
      }

      // 3. Subida a la nube / Local simulation
      initCloudinary();

      if (isCloudinaryConfigured) {
        try {
          writeLog("Uploading to Cloudinary...");
          // Upload to Cloudinary using secure buffer stream
          const uploadPromise = new Promise<{ secure_url: string }>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              {
                resource_type: isVideo ? "video" : "image",
                folder: "royal_grooming_catalog",
                // Apply requested transformations: auto format (f_auto) & auto-quality (q_auto) for fast mobile speed
                transformation: [{ quality: "auto", fetch_format: "auto" }],
              },
              (err, result) => {
                if (err || !result) {
                  reject(err || new Error("Fallo al subir a Cloudinary"));
                } else {
                  resolve(result as { secure_url: string });
                }
              }
            );
            uploadStream.end(file.buffer);
          });

          const uploadResult = await uploadPromise;
          finalMediaUrl = uploadResult.secure_url;
          writeLog(`Cloudinary upload success: ${finalMediaUrl}`);
        } catch (cloudinaryError: any) {
          writeLog(`Cloudinary upload error: ${cloudinaryError.message}`);
          return res.status(500).json({
            success: false,
            message: "Error técnico al subir archivo a Cloudinary.",
            error: cloudinaryError.message,
          });
        }
      } else {
        // Fallback simulation: Save to public uploads
        const fileExt = path.extname(file.originalname) || (isVideo ? ".mp4" : ".png");
        const uniqueFilename = `product_${Date.now()}${fileExt}`;
        const localFilePath = path.join(UPLOADS_DIR, uniqueFilename);
        
        fs.writeFileSync(localFilePath, file.buffer);
        
        // Use relative URL so it works on any domain (localhost, Render, etc.)
        finalMediaUrl = `/uploads/${uniqueFilename}`;
        writeLog(`Saved product file locally as simulation: ${finalMediaUrl}`);
      }
    }

    // 4. Save to JSON database
    const loadedFeatures = typeof features === "string" 
      ? features.split(",").map((f: string) => f.trim()).filter(Boolean)
      : Array.isArray(features) ? features : ["Calidad profesional garantizada"];

    const newProduct: DatabaseProduct = {
      id: `pr-${Date.now().toString().slice(-4)}`,
      name: String(name),
      category: category as any,
      priceRetail: Number(priceRetail),
      priceWholesaleMin: Number(priceWholesaleMin || priceRetail * 0.65),
      minWholesaleQty: Number(minWholesaleQty || 6),
      wholesaleUnitDesc: String(wholesaleUnitDesc || `Mínimo ${minWholesaleQty || 6} un.`),
      description: String(description || "Producto de estilismo formulado para barberos premium."),
      features: loadedFeatures,
      rating: 5.0,
      featured: true,
      inStock: true,
      imageUrl: finalMediaUrl,
      media_url: finalMediaUrl,
      media_type: mediaType,
      illustrationType: (illustrationType as any) || "pomade"
    };

    const currentProducts = getProductsFromDb();
    currentProducts.push(newProduct);
    saveProductsToDb(currentProducts);

    writeLog(`Successfully loaded and stored new product: ${newProduct.id} - ${newProduct.name}`);

    res.status(201).json({
      success: true,
      message: "¡Producto añadido exitosamente al catálogo Royal Grooming!",
      product: newProduct,
    });

  } catch (error: any) {
    writeLog(`Error in POST /api/products: ${error.message}\n${error.stack}`);
    res.status(500).json({
      success: false,
      message: "Fallo al procesar y almacenar el nuevo producto.",
      error: error.message,
    });
  }
});

// PUT API: Update an existing product (With optional file uploads to Cloudinary or simulation)
app.put("/api/products/:id", upload.single("media"), async (req, res, next) => {
  try {
    const productId = req.params.id;
    writeLog(`PUT /api/products/${productId} request received. Body keys: ${Object.keys(req.body || {}).join(", ")}, Has file: ${!!req.file}`);

    // 1. Password/Token Authentication Protection as requested:
    const authHeader = req.headers.authorization;
    const rawSecret = process.env.ADMIN_SECRET_TOKEN || "royal_admin_secret_token";
    const expectedToken = rawSecret.replace(/^["']|["']$/g, "").trim();
    const tokenPart = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;

    if (!tokenPart || tokenPart.trim() !== expectedToken) {
      writeLog(`Authentication failed for PUT. Raw Secret: "${rawSecret}", Received Token Part: "${tokenPart || "none"}"`);
      return res.status(401).json({
        success: false,
        message: `No autorizado. El token administrativo ingresado es inválido o no coincide con la configuración del servidor. Use "${expectedToken}" por defecto.`,
      });
    }

    const currentProducts = getProductsFromDb();
    const productIndex = currentProducts.findIndex(p => p.id.toLowerCase() === productId.toLowerCase());

    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado.",
      });
    }

    const existingProduct = currentProducts[productIndex];
    const {
      name,
      category,
      priceRetail,
      priceWholesaleMin,
      minWholesaleQty,
      wholesaleUnitDesc,
      description,
      features,
      mediaType,
      illustrationType,
      inStock,
      featured,
      rating
    } = req.body;

    let finalMediaUrl = existingProduct.media_url || existingProduct.imageUrl;
    let finalMediaType = mediaType || existingProduct.media_type || "image";

    if (req.file) {
      const file = req.file;
      const isVideo = file.mimetype.startsWith("video/") || file.originalname.endsWith(".mp4") || file.originalname.endsWith(".mov") || file.originalname.endsWith(".avi");
      finalMediaType = isVideo ? "video" : "image";
      
      const sizeInMB = file.size / (1024 * 1024);
      writeLog(`Processing uploaded file for edit: ${file.originalname} (${sizeInMB.toFixed(2)} MB), Type: ${file.mimetype}`);

      if (isVideo) {
        if (sizeInMB > 10) {
          return res.status(400).json({
            success: false,
            message: "El video de reemplazo supera el límite de 10 MB.",
          });
        }
      } else {
        if (sizeInMB > 2) {
          return res.status(400).json({
            success: false,
            message: "La imagen de reemplazo supera el límite de 2 MB.",
          });
        }
      }

      initCloudinary();

      if (isCloudinaryConfigured) {
        try {
          writeLog("Uploading replace file to Cloudinary...");
          const uploadPromise = new Promise<{ secure_url: string }>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              {
                resource_type: isVideo ? "video" : "image",
                folder: "royal_grooming_catalog",
                transformation: [{ quality: "auto", fetch_format: "auto" }],
              },
              (err, result) => {
                if (err || !result) {
                  reject(err || new Error("Fallo al subir a Cloudinary"));
                } else {
                  resolve(result as { secure_url: string });
                }
              }
            );
            uploadStream.end(file.buffer);
          });

          const uploadResult = await uploadPromise;
          finalMediaUrl = uploadResult.secure_url;
          writeLog(`Cloudinary upload success: ${finalMediaUrl}`);
        } catch (cloudinaryError: any) {
          writeLog(`Cloudinary edit upload error: ${cloudinaryError.message}`);
          return res.status(500).json({
            success: false,
            message: "Error técnico al subir archivo de reemplazo a Cloudinary.",
            error: cloudinaryError.message,
          });
        }
      } else {
        const fileExt = path.extname(file.originalname) || (isVideo ? ".mp4" : ".png");
        const uniqueFilename = `product_${Date.now()}${fileExt}`;
        const localFilePath = path.join(UPLOADS_DIR, uniqueFilename);
        
        fs.writeFileSync(localFilePath, file.buffer);
        
        // Use relative URL so it works on any domain
        finalMediaUrl = `/uploads/${uniqueFilename}`;
        writeLog(`Saved edited product file locally: ${finalMediaUrl}`);
      }
    }

    const loadedFeatures = typeof features === "string" 
      ? features.split(",").map((f: string) => f.trim()).filter(Boolean)
      : Array.isArray(features) ? features : existingProduct.features;

    // Update fields
    const updatedProduct = {
      ...existingProduct,
      name: name !== undefined ? String(name) : existingProduct.name,
      category: category !== undefined ? (category as any) : existingProduct.category,
      priceRetail: priceRetail !== undefined ? Number(priceRetail) : existingProduct.priceRetail,
      priceWholesaleMin: priceWholesaleMin !== undefined ? Number(priceWholesaleMin) : existingProduct.priceWholesaleMin,
      minWholesaleQty: minWholesaleQty !== undefined ? Number(minWholesaleQty) : existingProduct.minWholesaleQty,
      wholesaleUnitDesc: wholesaleUnitDesc !== undefined ? String(wholesaleUnitDesc) : existingProduct.wholesaleUnitDesc,
      description: description !== undefined ? String(description) : existingProduct.description,
      features: loadedFeatures,
      inStock: inStock !== undefined ? (String(inStock) === "true" || inStock === true) : existingProduct.inStock,
      featured: featured !== undefined ? (String(featured) === "true" || featured === true) : existingProduct.featured,
      rating: rating !== undefined ? Number(rating) : existingProduct.rating,
      imageUrl: finalMediaUrl,
      media_url: finalMediaUrl,
      media_type: finalMediaType,
      illustrationType: illustrationType !== undefined ? (illustrationType as any) : existingProduct.illustrationType
    };

    currentProducts[productIndex] = updatedProduct;
    saveProductsToDb(currentProducts);

    writeLog(`Successfully updated product: ${updatedProduct.id} - ${updatedProduct.name}`);

    res.status(200).json({
      success: true,
      message: "¡Producto actualizado exitosamente!",
      product: updatedProduct,
    });

  } catch (error: any) {
    writeLog(`Error in PUT /api/products/:id: ${error.message}\n${error.stack}`);
    res.status(500).json({
      success: false,
      message: "Fallo al procesar la actualización del producto.",
      error: error.message,
    });
  }
});

// DELETE API: Remove a product from catalogo
app.delete("/api/products/:id", async (req, res, next) => {
  try {
    const productId = req.params.id;
    writeLog(`DELETE /api/products/${productId} requested`);

    // 1. Password/Token Authentication Protection as requested:
    const authHeader = req.headers.authorization;
    const rawSecret = process.env.ADMIN_SECRET_TOKEN || "royal_admin_secret_token";
    const expectedToken = rawSecret.replace(/^["']|["']$/g, "").trim();
    const tokenPart = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;

    if (!tokenPart || tokenPart.trim() !== expectedToken) {
      writeLog(`Authentication failed for DELETE. Raw Secret: "${rawSecret}", Received Token part: "${tokenPart || "none"}"`);
      return res.status(401).json({
        success: false,
        message: "No autorizado. Token incorrecto.",
      });
    }

    const currentProducts = getProductsFromDb();
    const productIndex = currentProducts.findIndex(p => p.id.toLowerCase() === productId.toLowerCase());

    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado.",
      });
    }

    const removedProduct = currentProducts.splice(productIndex, 1)[0];
    saveProductsToDb(currentProducts);

    writeLog(`Successfully deleted product: ${removedProduct.id} - ${removedProduct.name}`);

    res.status(200).json({
      success: true,
      message: `¡Producto #${removedProduct.id.toUpperCase()} eliminado exitosamente!`,
    });
  } catch (error: any) {
    writeLog(`Error in DELETE /api/products/:id: ${error.message}\n${error.stack}`);
    res.status(500).json({
      success: false,
      message: "Fallo al eliminar el producto.",
      error: error.message,
    });
  }
});

// JSON Error Handling Middleware to trap Multer / Express native errors and prevent raw HTML output
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  writeLog(`EXPRESS GLOBAL ERROR HANDLER TRAPPED: ${err.message}\n${err.stack}`);
  if (res.headersSent) {
    return next(err);
  }
  res.status(err.status || err.statusCode || 500).json({
    success: false,
    message: err.message || "Un error técnico interno ocurrió en el servidor de catálogo.",
    error: err.toString()
  });
});

// Vite Middleware & static assets pipeline configuration
async function startServer() {
  try {
    writeLog("Starting API server...");
    app.listen(PORT, "0.0.0.0", () => {
      writeLog(`API server successfully booted on: http://0.0.0.0:${PORT}`);
      writeLog(`Uploads served at: /uploads`);
      writeLog(`API endpoints: GET/POST /api/products, PUT/DELETE /api/products/:id`);
    });
  } catch (err: any) {
    writeLog(`CRITICAL START ERROR: ${err.message}\n${err.stack}`);
  }
}

startServer();
