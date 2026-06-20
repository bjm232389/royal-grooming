/**
 * ==========================================
 * NEXT.JS API ROUTE (App Router) FOR ROYAL GROOMING
 * File: /app/api/products/route.js
 * ==========================================
 * Handles dynamic POST (Admin uploads with Cloudinary) and GET (Public search) requests.
 */

import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary from server environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * GET ENDPOINT: Retrieve catalog list (Public)
 * Path: GET /api/products?category=beard
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    // Connection with DB representation (e.g. Supabase Postgres connection)
    // Replace with: const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    
    // Fallback/Demo Mock database select representation:
    const mockProductsFromDB = [
      {
        id: "pr-01",
        name: "Royal Beard Oil Premium",
        category: "beard",
        priceRetail: 1250,
        priceWholesaleMin: 750,
        minWholesaleQty: 6,
        media_url: "https://res.cloudinary.com/demo/image/upload/v1/hair_oil.png",
        media_type: "image",
        created_at: new Date().toISOString()
      }
    ];

    let responseList = mockProductsFromDB;
    if (category && category !== 'all') {
      responseList = mockProductsFromDB.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    return NextResponse.json({
      success: true,
      count: responseList.length,
      products: responseList
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Fallo al procesar consulta del catálogo.',
      error: error.message
    }, { status: 500 });
  }
}

/**
 * POST ENDPOINT: Add a new premium product with Cloudinary delivery
 * Path: POST /api/products
 * Security: Administrative Admin Secret Token via Bearer Authorization Header
 */
export async function POST(request) {
  try {
    // 1. ADMIN AUTHORIZATION SHIELD
    const authHeader = request.headers.get('authorization');
    const systemSecret = process.env.ADMIN_SECRET_TOKEN || 'royal_admin_secret_token';

    if (!authHeader || authHeader !== `Bearer ${systemSecret}`) {
      return NextResponse.json({
        success: false,
        message: 'No autorizado: Token de seguridad administrativo inválido.'
      }, { status: 401 });
    }

    // 2. PARSE MULTIPART FORM DATA
    const formData = await request.formData();
    
    const name = formData.get('name');
    const priceRetailStr = formData.get('priceRetail');
    const priceWholesaleMinStr = formData.get('priceWholesaleMin');
    const minWholesaleQtyStr = formData.get('minWholesaleQty');
    const category = formData.get('category');
    const description = formData.get('description');
    const featuresRaw = formData.get('features'); 
    const file = formData.get('media'); // Multi-part file upload

    // Core attributes validations
    if (!name || !priceRetailStr || !category) {
      return NextResponse.json({
        success: false,
        message: 'Faltan campos mandatorios: nombre, precio retail, o categoría.'
      }, { status: 400 });
    }

    const priceRetail = parseFloat(priceRetailStr);
    const priceWholesaleMin = priceWholesaleMinStr ? parseFloat(priceWholesaleMinStr) : priceRetail * 0.65;
    const minWholesaleQty = minWholesaleQtyStr ? parseInt(minWholesaleQtyStr, 10) : 6;

    let mediaUrl = "";
    let mediaType = 'image';

    // 3. FILE SIZE CHECK & UPLOAD PROCESS
    if (file) {
      const isVideo = file.type.startsWith('video/');
      mediaType = isVideo ? 'video' : 'image';

      const fileBytes = await file.arrayBuffer();
      const fileSizeInMB = fileBytes.byteLength / (1024 * 1024);

      // Validate strict limits: Images <= 2MB, Videos <= 10MB
      if (isVideo) {
        if (fileSizeInMB > 10) {
          return NextResponse.json({
            success: false,
            message: 'El video excede el límite permitido de 10 MB.'
          }, { status: 400 });
        }
      } else {
        if (fileSizeInMB > 2) {
          return NextResponse.json({
            success: false,
            message: 'La imagen excede el límite permitido de 2 MB.'
          }, { status: 400 });
        }
      }

      // Convert array buffer to base64 for Cloudinary delivery
      const buffer = Buffer.from(fileBytes);
      const base64File = `data:${file.type};base64,${buffer.toString('base64')}`;

      // Upload directly utilizing our optimized cloud presets
      const uploadResult = await cloudinary.uploader.upload(base64File, {
        resource_type: isVideo ? "video" : "image",
        folder: "royal_grooming_catalog",
        transformation: [
          { quality: "auto", fetch_format: "auto" }
        ]
      });

      mediaUrl = uploadResult.secure_url;
    }

    // 4. WRITE DATA DIRECTLY TO DATABASE
    const parsedFeatures = featuresRaw 
      ? featuresRaw.split(',').map(f => f.trim()).filter(Boolean)
      : ['Calidad Barber Profesional'];

    const newProductObject = {
      name,
      category,
      priceRetail,
      priceWholesaleMin,
      minWholesaleQty,
      description,
      features: parsedFeatures,
      media_url: mediaUrl,
      media_type: mediaType,
      created_at: new Date().toISOString()
    };

    // Replace with Supabase or Mongoose mongo insert commands:
    // await Product.create(newProductObject);

    return NextResponse.json({
      success: true,
      message: '¡Producto subido y catalogado con éxito en Cloudinary!',
      product: newProductObject
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Error al subir u homologar el producto.',
      error: error.message
    }, { status: 500 });
  }
}
