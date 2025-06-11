import productModel from "../models/productModel.js";
import categoryModel from '../models/categoryModel.js'
import fs from 'fs';
import slugify from "slugify";
import braintree from "braintree";

//payment gateway
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey:process.env.BRAINTREE_PRIVATE_KEY,
});

export const createProductController = async (req, res) => {
    try {
        const { name, slug, description, price, category, shipping, quantity } = req.fields;
        const { photo } = req.files;

        // Validate required fields
        if (!name) return res.status(400).send({ error: 'Name is required' });
        if (!slug && !name) return res.status(400).send({ error: 'Slug is required or Name should be provided to generate one' });
        if (!description) return res.status(400).send({ error: 'Description is required' });
        if (!category) return res.status(400).send({ error: 'Category is required' });
        if (!price) return res.status(400).send({ error: 'Price is required' });
        if (!quantity) return res.status(400).send({ error: 'Quantity is required' });

        // Validate photo size
        if (photo && photo.size > 1000000) { // 1MB in bytes
            return res.status(400).send({ error: 'Photo is required and should be less than 1 MB' });
        }

        // Generate slug if not provided
        const slugToUse = slug || slugify(name);

        // Create new product instance
        const product = new productModel({
            ...req.fields,
            slug: slugToUse
        });

        // Handle photo upload
        if (photo) {
            product.photo.data = fs.readFileSync(photo.path);
            product.photo.contentType = photo.type;
        }

        // Save the product
        await product.save();

        // Send success response
        res.status(201).send({
            success: true,
            message: 'Product Created Successfully',
            product

        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Error in Product Creation',
            error: error.message
        });
    }
};


export const getProductCotroller = async (req, res) => {
    try {
        const products = await productModel.find({}).populate('category').select("-photo").limit(12).sort({ createdAt: -1 })
        res.status(200).send({
            success: true,
            message: "All Products",
            products,
            total: products.length,
        })
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Error while getting Products',
            error: error.message
        });
    }
}

//get single product
export const getSingleProductController = async (req, res) => {
    try {
        const product = await productModel.findOne({ slug: req.params.slug })
            .select("-photo")//Exclude photo from the response
            .populate("category");//Populate the 'category' field

        // If no product is found, send a 404 error
        if (!product) {
            return res.status(404).send({
                success: false,
                message: 'Product not found'
            });
        }

        // Send successful response
        res.status(200).send({
            success: true,
            message: 'Single Product Fetched',
            product
        })
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Error while getting Single Products',
            error: error.message
        });
    }
}

//get photo
export const productPhotoController = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.pid).select("photo")
        if (product.photo.data) {
            res.set('Content-type', product.photo.contentType)
            return res.status(200).send(product.photo.data)
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Error while getting photo',
            error: error.message
        });
    }
};

// Delete product controller

export const deleteProductController = async (req, res) => {
    try {
        const productId = req.params.pid;


        // Proceed to delete the product if it's valid
        const product = await productModel.findByIdAndDelete(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
            product,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting product",
            error: error.message,
        });
    }
};


//upate producta
export const updateProductController = async (req, res) => {
    try {
        const { name, description, price, category, quantity, shipping } = req.fields;
        const { photo } = req.files;

        // Validation
        switch (true) {
            case !name:
                return res.status(400).send({ error: "Name is Required" });
            case !description:
                return res.status(400).send({ error: "Description is Required" });
            case !price:
                return res.status(400).send({ error: "Price is Required" });
            case !category:
                return res.status(400).send({ error: "Category is Required" });
            case !quantity:
                return res.status(400).send({ error: "Quantity is Required" });
            case photo && photo.size > 1000000:
                return res.status(400).send({ error: "Photo should be less than 1MB" });
        }

        const product = await productModel.findById(req.params.pid);
        if (!product) {
            return res.status(404).send({
                success: false,
                message: 'Product not found'
            });
        }

        // Update product
        const updatedProduct = await productModel.findByIdAndUpdate(
            req.params.pid,
            { ...req.fields, slug: slugify(name) },
            { new: true }
        );

        if (photo) {
            updatedProduct.photo.data = fs.readFileSync(photo.path);
            updatedProduct.photo.contentType = photo.type;
        }

        await updatedProduct.save();

        res.status(200).send({
            success: true,
            message: "Product Updated Successfully",
            product: updatedProduct,
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({
            success: false,
            message: 'Error in updating product',
            error: error.message || error,
        });
    }
};

//filter in product

export const productFiltersController = async (req, res) => {
    try {
        const { checked, radio } = req.body
        let args = {}
        if (checked.length > 0) args.category = { $in: checked };
        if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] }

        //check price and add filternon it
        if (Array.isArray(radio) && radio.length === 2) {
            const [minPrice, maxPrice] = radio;
            args.price = { $gte: minPrice, $lte: maxPrice }; // Filter by price range
        }

        const products = await productModel.find(args).populate('category').select("-photo").limit(12).sort({ createdAt: -1 })

        res.status(200).send({
            success: true,
            products,
        })
    }
    catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "Error while filtering products",
            error
        })
    }
}

export const productCountController = async (req, res) => {
    try {
        const total = await productModel.find({}).estimatedDocumentCount();
        res.status(200).send({
            success: true,
            total
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "Error while get product count",
            error
        })
    }
};

//product list base on page
export const productListController = async (req, res) => {
    try {
        const perPage = 6
        const page = req.params.page ? req.params.page : 1
        const products = await productModel
            .find({})
            .select("-photo")
            .skip((page - 1) * perPage)
            .limit(perPage)
            .sort({ createdAt: -1 })

        res.status(200).send({
            success:true,
            products,
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: 'Error while getting product list per page',
            error
        })
    }
}

export const searchProductController = async(req,res) =>{
    try{
        const {keyword} = req.params
        const result = await productModel.find({
            $or:[
                {name:{$regex :keyword,$options:"i"}},
                {description:{$regex :keyword,$options:"i"}}
            ]
        }).select("-photo")

        res.json(result);
    }catch(error){
        console.log(error);
        res.status(400).send({
            success:false,
            message:'Error In Search Product API',
            error
        })
    }
};

//similar products
export const realtedProductController = async(req,res) => {
    try{
        const {pid,cid} = req.params
        const product = await productModel.find({
            category:cid,
            _id:{$ne:pid}
        }).select("-photo").limit(3).populate("category")

        res.status(200).send({
            success:true,
            product,
        })
    }catch(error){
        console.log(error);
        res.status(400).send({
            success:false,
            message: "Error in getting similar Products",
            error
        });
    }
}

//get products by category
export const productCategoryController = async(req,res) => {
    try{
        const category = await categoryModel.findOne({slug:req.params.slug})
        const products = await productModel.find({category}).populate('category')
        console.log(category);
        console.log(products);
        res.status(200).send({
            success:true,
            category,
            products
        })
    }catch(error){
        console.log(error);
        res.status(400).send({
            success:false,
            message:"Error in getting product category wise",
            error
        })
    }
}

