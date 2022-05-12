const { mongooseToObject } = require('../../config/utility/mongoose')
const { multipleToObject } = require('../../config/utility/mongoose');

const Product = require('../models/Product');
const User = require('../models/User');

//[GET] /adminProduct
const showProductList = async(req, res, next) => {
    const user = await User.findOne({ role: 'admin' });
    const products = await Product.find({});
    res.render('TabAdmin/admin-product-list', { layout: 'mainAdmin.hbs', products: multipleToObject(products), user: mongooseToObject(user) });
}

//[GET] /adminProduct/createProduct
const showCreateList = async(req, res, next) => {
    const user = await User.findOne({ role: 'admin' });
    res.render('TabAdmin/admin-product-form', { layout: 'mainAdmin.hbs', user: mongooseToObject(user) });
}

//[POST] /adminProduct/createProduct/save
const createProduct = async(req, res, next) => {
    const { name, category, price, gender, sizes, qty } = req.body;
    // res.json(req.body)
    const product = new Product({
        name,
        category,
        gender,
        price,
    });
    await product.save();
    if(typeof(req.body.sizes) === 'object') {
        await Product.findOneAndUpdate({ _id: product._id }, {
            $push: {
                skus: [{
                    sku: req.body.sku,
                    img: req.body.img,
                    color: {
                        title: req.body.color_name,
                        color_code: req.body.color_id,
                    },
                    sizes: []
                }]
            }
        }, { new: true });

        for(var i = 0; i < req.body.sizes.length; i++) {
            await Product.updateOne(
                    {_id: product._id, 'skus.sku': req.body.sku},
                    { $push: {
                        'skus.$.sizes': {size: req.body.sizes[i], qty: req.body.qty[i]}
                    }},
                    // {arrayFilters: [{'skus.sku': order.items[i].size}]}
                )
        }
    }
    else {
        await Product.findOneAndUpdate({ _id: product._id }, {
            $push: {
                skus: [{
                    sku: req.body.sku,
                    img: req.body.img,
                    color: {
                        title: req.body.color_name,
                        color_code: req.body.color_id,
                    },
                    sizes: [{
                        size: req.body.sizes, 
                        qty: req.body.qty,
                    }]
                }]
            }
        }, { new: true });
    }


    const user = await User.findOne({ role: 'admin' });
    Product.findById(product._id)
        .then(p => {
            console.log(p);
            res.render('TabAdmin/admin-skus-form', { layout: 'mainAdmin.hbs', p: mongooseToObject(p), user: mongooseToObject(user) });
        })
}

// [POST] /adminProduct/createProduct/save/:id/saveSkus
const createSkus = async(req, res, next) => {
    if(typeof(req.body.sizes) === 'object') {
        await Product.updateOne({ _id: req.params.id }, {
            $push: {
                skus: [{
                    sku: req.body.sku,
                    img: req.body.img,
                    color: {
                        title: req.body.color_name,
                        color_code: req.body.color_id,
                    },
                    sizes: []
                }]
            }
        }, { new: true });

        for(var i = 0; i < req.body.sizes.length; i++) {
            await Product.updateOne(
                    {_id: req.params.id, 'skus.sku': req.body.sku},
                    { $push: {
                        'skus.$.sizes': {size: req.body.sizes[i], qty: req.body.qty[i]}
                    }},
                    // {arrayFilters: [{'skus.sku': order.items[i].size}]}
                )
        }
    }
    else {
        await Product.updateOne({ _id: req.params.id }, {
            $push: {
                skus: [{
                    sku: req.body.sku,
                    img: req.body.img,
                    color: {
                        title: req.body.color_name,
                        color_code: req.body.color_id,
                    },
                    sizes: [{
                        size: req.body.sizes,
                        qty: req.body.qty,
                    }]
                }]
            }
        }, { new: true });
    }
    // res.redirect('back');
    // res.redirect('TabAdmin/admin-skus-form');
    // const product1 = await Product.findById(req.params.id);

    // const product = new Product.findById({ id: req.params.id }, function(err, product) {
    //     sku, 
    //     img,
    //     color,
    //     sizes
    // });
    // const product = new Product.findById(req.params.id, {
    //         $push: {
    //             skus: {
    //                 sku,
    //                 img,
    //                 color,   
    //                 sizes
    //             }
    //         }
    //     },
    //     function(err, product) {
    //         console.log(product);
    //     });
    // console.log(req.body);
    // await product.save();
    // res.json(req.body);  
    // res.redirect('/admin/adminCreateList/step2');
    
}

//[GET] /adminProduct/:id/editProduct
const showEditProduct = async(req, res, next) => {
    const user = await User.findOne({ role: 'admin' });
    const product = await Product.findById(req.params.id);
    res.render('TabAdmin/admin-edit-form', { layout: 'mainAdmin.hbs', product: mongooseToObject(product), user: mongooseToObject(user) });
}

//[PUT] /adminProduct/:id
const updateProduct = async(req, res, next) => {
    const p = await Product.updateOne({ _id: req.params.id }, {
        name: req.body.name,
        category: req.body.category,
        gender: req.body.gender,
        price: req.body.price,
        //     $push: {
        //         skus: [{
        //             sku: req.body.sku,
        //             img: req.body.img,
        //             color: {
        //                 title: req.body.color_name,
        //                 color_code: req.body.color_id,
        //             },
        //             sizes: [{
        //                 size: req.body.sizes,
        //                 qty: req.body.qty,
        //             }]
        //         }]
        //     }
        // }, { new: true });
    });
    // console.log(p)
    res.redirect('/adminProduct')
}

//[DELETE] /adminProduct/deleteProduct/:id
const deleteProduct = async(req, res, next) => {
    Product.deleteOne({ _id: req.params.id })
        .then(() => res.redirect('/adminProduct'))
        .catch(next);
}


module.exports = { showProductList, showCreateList, createProduct, createSkus, showEditProduct, updateProduct, deleteProduct }