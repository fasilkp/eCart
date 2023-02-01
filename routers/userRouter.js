import express from "express"
import { addToCart, addToWishlist, getAddAddress, getCart, getCheckout, getCoupons, getEditAddress, getHome, getOrderHistory, getOrderProduct, getProduct, getProductList, getUserProfile, getWishlist, removeFromCart, removeFromWishlist } from "../controllers/userController.js"
import checkUser from "../middlewares/checkUser.js"
const router = express.Router()
import verifyUser from "../middlewares/verifyUser.js"

router.get("/", getHome)
router.get("/search", getProductList)
router.get("/product/:id",checkUser, getProduct)

router.use(verifyUser);
router.use(checkUser);

router.get("/wishlist", getWishlist)
router.get("/cart", getCart)
router.get("/orders", getOrderHistory)
router.get("/checkout", getCheckout)
router.get("/add-address", getAddAddress)
router.get("/edit-address", getEditAddress)
router.get("/ordered-product", getOrderProduct)
router.get("/profile", getUserProfile)
router.get("/coupons", getCoupons)


router.get("/add-to-wishlist/:id", addToWishlist);
router.get("/remove-from-wishlist/:id", removeFromWishlist);
router.get("/add-to-cart/:id", addToCart);
router.get("/remove-from-cart/:id", removeFromCart);



export default router