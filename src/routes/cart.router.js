import { Router } from "express";
import { CartManager } from "../managers/cart.manager.js";

const router = Router();
const cartManager = new CartManager('./src/data/cart.json');

router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ error: "Error al crear el carrito" });
    }
});

router.get('/', async (req, res) => {
    try {
        const allCarts = await cartManager.getCarts();
        res.status(200).json(allCarts);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener carritos" });
    }
});

router.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartManager.getCartById(parseInt(cid, 10));

        if (cart) {
            res.status(200).json(cart);
        } else {
            res.status(404).json({ error: `No existe el carrito con el ID ${cid}` });
        }
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el carrito" });
    }
});

router.post('/:idCart/product/:idProd', async (req, res) => {
    const { idProd, idCart } = req.params;  // Obtener IDs de producto y carrito de los parámetros de la URL

    try {
        // Llamar al método para buscar el carrito por su ID
        const cart = await cartManager.getCartById(parseInt(idCart, 10));

        if (cart) {
            // Llamar al método para buscar el producto por su ID
            const product = await cartManager.getProductById(parseInt(idProd, 10));

            if (product) {
                // Llamar al método que guarda el producto en el carrito (el carrito previamente creado)
                const updatedCart = await cartManager.saveProductToCart(parseInt(idCart, 10), parseInt(idProd, 10));
                console.log(updatedCart);
                if (updatedCart) {
                    res.status(201).json({ message: 'Producto agregado al carrito correctamente', updatedCart });
                } else {
                    res.status(500).json({ error: 'Error al guardar el producto en el carrito' });
                }
            } else {
                res.status(404).json({ error: `El producto con el ID ${idProd} no existe` });
            }
        } else {
            res.status(404).json({ error: `El carrito con el ID ${idCart} no existe` });
        }
    } catch (error) {
        res.status(500).json({ error: "Error en la solicitud" });
    }
});

export default router;