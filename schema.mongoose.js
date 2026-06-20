/**
 * ==========================================
 * MONGOOSE SCHEMA FOR ROYAL GROOMING PRODUCT CATALOG
 * Platform: MongoDB / MongoDB Atlas (using Mongoose)
 * ==========================================
 */

import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre comercial del producto es obligatorio.'],
      trim: true,
      maxlength: [200, 'El nombre no puede exceder los 200 caracteres.']
    },
    category: {
      type: String,
      required: [true, 'La categoría del producto es obligatoria.'],
      enum: {
        values: ['beard', 'hair', 'tools', 'wholesale'],
        message: '{VALUE} no es una categoría válida para Royal Grooming.'
      }
    },
    priceRetail: {
      type: Number,
      required: [true, 'El precio al detalle es obligatorio.'],
      min: [0, 'El precio no puede ser negativo.']
    },
    priceWholesaleMin: {
      type: Number,
      required: [true, 'El precio al por mayor mínimo es obligatorio.'],
      min: [0, 'El precio no puede ser negativo.']
    },
    minWholesaleQty: {
      type: Number,
      default: 6,
      min: [1, 'La cantidad mínima al por mayor debe ser al menos 1.']
    },
    wholesaleUnitDesc: {
      type: String,
      default: 'Mínimo 6 un.'
    },
    description: {
      type: String,
      trim: true
    },
    features: {
      type: [String],
      default: []
    },
    rating: {
      type: Number,
      default: 5.0,
      min: 0,
      max: 5
    },
    featured: {
      type: Boolean,
      default: false
    },
    inStock: {
      type: Boolean,
      default: true
    },
    media_url: {
      type: String,
      required: [true, 'La URL multimedia de Cloudinary es requerida.']
    },
    media_type: {
      type: String,
      enum: ['image', 'video'],
      default: 'image'
    },
    illustrationType: {
      type: String,
      enum: ['oil', 'balm', 'pomade', 'spray', 'razor', 'comb', 'clipper', 'pack'],
      default: 'pomade'
    }
  },
  {
    timestamps: true // Auto creates 'createdAt' and 'updatedAt'
  }
);

// Indexes for high performance querying
ProductSchema.index({ category: 1 });
ProductSchema.index({ createdAt: -1 });

// Prevent compiling model multiple times in hot-reload
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

export default Product;
