const { Router } = require("express");
const {
  homePage,
  create,
  downQrCode,
  qrscaner,
  qrscanner,
  
} = require("../controller/home.controller");

const router = Router();

router.get("/", homePage);
router.get("/qrscaner", qrscaner);
router.post("/qrscanner", qrscanner);
router.get("/qrcodedownload", downQrCode);
router.post("/qrcode", create);

module.exports = router;
