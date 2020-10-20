import React from 'react';

const ReviewItems = (props) => {
    const {name, quantity, key, price} = props.product;
    const reviewItemStyle = {
        borderBottom: '1px solid lightgray',
        marginBottom: '5px',
        paddingBottom: '5px',
        marginLeft: '200px'
    };
    return (
        <div style={reviewItemStyle} className="review-items">
            <h5 className="product-name">{name}</h5>
            <p>Quantity: {quantity}</p>
            <p><small>${price}</small></p>
            <br/>
            <button
               className="main-button"
               onClick = {() => props.removeProduct(key)} 
             >Remove</button>
        </div>
    );
};

export default ReviewItems;