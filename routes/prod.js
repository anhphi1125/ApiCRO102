var express = require('express');
var router = express.Router();

const Product = require('../models/prodModel');

//lấy danh sách theo mục
router.get('/prodByType', async (req, res) => {
    try {
        const {type} = req.query;

        if(!type){
            return res.status(400).json({message: "Vui lòng cung cấp type"});
        }

        const products = await Product.find({type: type});

        if(products.length == 0){
            return res.status(404).json({message: "Không tìm thấy sản phẩm nào"});
        }

        res.status(201).json({message: "Lấy sản phẩm thành công", products});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
});

//lấy danh sách theo attribute
router.get('/prodByAttribute', async (req, res) => {
    try {
        const {attribute} = req.query;

        if(!attribute){
            return res.status(400).json({message: "Vui lòng cung cấp attributeattribute"});
        }

        const products = await Product.find({attribute: attribute});

        if(products.length == 0){
            return res.status(404).json({message: "Không tìm thấy sản phẩm nào"});
        }

        res.status(201).json({message: "Lấy sản phẩm thành công", products});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
});

//Lấy danh sách sản Phẩm
router.get('/getAllProd', async (req, res) => {
    try {
        const products = await Product.find();

        if(products.length == 0){
            return res.status(404).json({message: "Không tìm thấy sản phẩm nào"});
        }

        res.status(201).json({ message: "Lấy sản phẩm thành công", products});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
});

//lấy chi tiết sản phẩm
router.get('/getProd', async (req, res) => {
    try {
        const {_id} = req.query;

        if(!_id) {
            return res.status(400).json({message: 'Vui lòng truyền vào id'});
        }

        const product = await Product.findOne({ _id });

        if(!product){
            res.status(404).json({message: 'Không tìm thấy sản phẩm'});
        }

        res.status(200).json({message: "Lấy sản phẩm thành công", product})
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
});

// API tìm kiếm sản phẩm theo tên hoặc loại
router.get('/search', async (req, res) => {
    try {
        const { query } = req.query; // Lấy từ khóa tìm kiếm từ query params
        if (!query) {
            return res.status(400).json({ message: "Vui lòng nhập từ khóa tìm kiếm!" });
        }

        // Tìm kiếm trong các trường name và type (không phân biệt hoa thường)
        const products = await Product.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { type: { $regex: query, $options: 'i' } }
            ]
        });

        res.json({ products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
});

module.exports = router;