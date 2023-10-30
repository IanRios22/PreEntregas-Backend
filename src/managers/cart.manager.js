import fs from "fs";

export class CartManager {
  constructor(path) {
    this.path = path;
  }

  async getCarts() {
    try {
      if (fs.existsSync(this.path)) {
        const cartsJSON = await fs.promises.readFile(this.path, "utf-8");
        return JSON.parse(cartsJSON);
      } else return [];
    } catch (error) {
      console.log(error);
      return []
    }
  }

  async #getMaxId() {
    let maxId = 0;
    const carts = await this.getCarts();
    carts.map((cart) => {
      if (cart.id > maxId) maxId = cart.id;
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

  async getCartById(id) {
    try {
      const carts = await this.getCarts();
      const cart = carts.find(c => c.id === id);
      return cart || null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async saveProductToCart(idCart, idProd) {
    try {
      const carts = await this.getCarts();
      const cartIndex = carts.findIndex((cart) => cart.id === idCart);
      if (cartIndex === -1) return false;

      const cart = carts[cartIndex];
      const existingProductIndex = cart.products.findIndex(
        (product) => product.product === idProd
      );

      if (existingProductIndex !== -1) {
        cart.products[existingProductIndex].quantity += 1;
      } else {
        const newProduct = { product: idProd, quantity: 1 };
        cart.products.push(newProduct);
      }

      await fs.promises.writeFile(this.path, JSON.stringify(carts));
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
