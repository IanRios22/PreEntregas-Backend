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

    try {
        const { idProd, idCart } = req.params;
        const cartID = Number(idCart);
        const prodID = Number(idProd);
        const cart = await cartManager.getCartById(cartID);
        if (!cart) {
            res.status(404).json({ message: "carrito no encontrado." });
        } else {
            await cartManager.saveProductToCart(cartID, prodID)
            res.status(200).json({ message: "Producto agregado al carrito." });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error en la solicitud" });
    }
});


export default router;
