import React from "react";
const productLibrary = require("../util/product-library.js");
let products = productLibrary.getProducts();

const tableStyles = {
  header: {
    headerRow: {
      backgroundColor: '#707070'
    },
    headerCell: {
      fontWeight: '400',
      color: 'white',
      padding: '0.5em 1em'

    }
  },
  row: {
    image: {
      maxWidth: '150px',
      padding: '10px 2em'
    },
    cell: {
      border: '1px solid #707070',
      padding: '0.5em 2em'
    }
  },
  general: {
    borderCollapse: 'collapse',
    marginLeft: 'auto',
    marginRight: 'auto'
  }
};

const PLACEHOLDER_IMAGE_URL = 'https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png?format=webp&v=1530129081';

class Index extends React.Component {
  constructor() {
    super();
    this.state = {
      products: products,
      tableHeaders: ["Image", "Title", "Price", "Number of Colors"]
    }
  }

  /*
  * getCurrencyPrice(price)
  * 
  * Returns a USD version of a price given in cents
  */
  getCurrencyPrice(price) {
    const dollars = price / 100;
    return dollars.toLocaleString('en-US', { style: 'currency', currency: 'USD'});
  }

  /*
  * getPriceRange(product)
  * 
  * Returns the price range of a product if variants cost different, or one price if all variants cost the same
  */
  getPriceRange(product) {
    if(product.priceVaries) {
      return (
        this.getCurrencyPrice(product.price_min) - this.getCurrencyPrice(product.price)
      );
    }

    return (
      this.getCurrencyPrice(product.price)
    );
  }

  /*
  * getNumOfColors(product)
  * 
  * Returns the number of colors available for the product
  */
  getNumOfColors(product) {
    const numOfColors = product.colors && Object.keys(product.colors).length ? Object.keys(product.colors).length : 0;
    if(numOfColors > 1) {
      return `${numOfColors} Colors Available`;
    } else if (numOfColors === 1) {
      return `${numOfColors} Color Available`;
    }

    return 'No Colors';
  }

  /*
  * onImageError(event)
  * 
  * Replaces an image with a placeholder image in case the original URL given outputs a 404 (or any) error
  */
  onImageError(event) {
    event.target.onerror = null;
    event.target.src = PLACEHOLDER_IMAGE_URL;
  }

  /*
  * getImage(product)
  * 
  * Returns the image of a product, or a placeholder if there is no image
  */
  getImage(product) {
    if(product.featured_image) {
      return <img src={product.featured_image} onError={this.onImageError} style={tableStyles.row.image} alt={`Product Image for ${product.title}`} />;
    }

    // Return a placeholder image if there is no image
    return <img src={PLACEHOLDER_IMAGE_URL} alt={`Product Image for ${product.title}`} />
  }

  /*
  * buildProductRow(productHandle)
  * 
  * Given the product's handle, builds out the product row in the table
  */
  buildProductRow(productHandle) {
    const product = this.state.products[productHandle];
    return (
      <tr key={`product-row-${productHandle}`}>
        <td style={tableStyles.row.cell}>
          {this.getImage(product)}
        </td>
        <td style={tableStyles.row.cell}>
          {product.title}
        </td>
        <td style={tableStyles.row.cell}>
          {this.getPriceRange(product)}
        </td>
        <td style={tableStyles.row.cell}>
          {this.getNumOfColors(product)}
        </td>
      </tr>
    );
  }

  render() {
    return (
      <table style={tableStyles.general}>
        <thead>
          <tr style={tableStyles.header.headerRow}>
            {this.state.tableHeaders.map(th => (
              <th style={tableStyles.header.headerCell} key={th}>{th}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.keys(products).map(product => this.buildProductRow(product))}
        </tbody>
      </table>
    );
  }
}

export default Index;
