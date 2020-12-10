import React, { useEffect } from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Product from '../Product/Product';

const ProductDetail = () => {
    const {productKey} = useParams();
    const [product, setProduct] = useState({})
    useEffect(() => {
        fetch('https://gentle-ridge-31201.herokuapp.com/product/'+productKey)
        .then(res => res.json())
        .then(data => setProduct(data))
    }, [productKey]);
    
    
    return (
        <div>
            <h4>Your product details here</h4>
            <Product showAddToCart={false} product={product}></Product>
        </div>
    );
};

export default ProductDetail;