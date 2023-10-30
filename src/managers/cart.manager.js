import fs from "fs";
import { ProductManager } from '../managers/product.manager.js';

export class CartManager {
  constructor(path) {
    this.path = path;
    this.productManager = new ProductManager();
  }

  async getCarts() {
    try {
      if (fs.existsSync(this.path)) {
        const cartsJSON = await fs.promises.readFile(this.path, "utf-8");
        return JSON.parse(cartsJSON);
      } else return [];
    } catch (error) {
      console.log(error);
    }
  }

  async #getMaxId() {
    let maxId = 0;
    const carts = await this.getCarts();
    carts.map((prod) => {
      if (prod.id > maxId) maxId = prod.id;
    });
    return maxId;
  }

  async createCart() {
    try {
      const cart = {
        id: (await this.#getMaxId()) + 1,
        products: [],
      };
      const cartsFile = await this.getCarts();
      cartsFile.push(cart);
      await fs.promises.writeFile(this.path, JSON.stringify(cartsFile));
      return cart;
    } catch (error) {
      console.log(error);
    }
  }
  async saveProductToCart(idCart, idProd) {
    const carts = await this.getCarts();
    const cartExists = await this.getCartById(idCart);
    const productExists = await this.productManager.getProductById(idProd);

    if (cartExists) {
      if (productExists) {
        // Comprobamos si el producto ya existe en el carrito
        const existingProduct = cartExists.products.find(p => p.product === idProd);

        if (existingProduct) {
          existingProduct.quantity += 1;
        } else {
          // Si no existe, lo añadimos
          const prod = {
            product: idProd, // Usamos 'product' para hacer referencia al producto
            quantity: 1,
          };
          cartExists.products.push(prod);
        }

        // Guardamos el carrito actualizado
        await fs.promises.writeFile(this.path, JSON.stringify(carts));
        return cartExists;
      } else {
        console.log(`El producto con ID ${idProd} no existe.`);
        return null;
      }
    } else {
      console.log(`El carrito con ID ${idCart} no existe.`);
      return null;
    }
  }


  async getProductById(id) {
    try {
      const product = await this.productManager.getProductById(id);
      if (product) {
        return product;
      } else {
        console.log(`El producto con ID ${id} no existe.`);
        return null;
      }
    } catch (error) {
      console.error(error);
    }
  }

  async getCartById(id) {
    try {
      const carts = await this.getCarts();
      const cart = carts.find(c => c.id === id);
      if (!cart) return null;
      return cart;
    } catch (error) {
      console.log(error);
    }
  }
}
