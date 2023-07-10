var Jimp = require("jimp");
var QrCode = require('qrcode-reader');
const fs = require('fs');
const QRCode = require("qrcode");
const { v4: uuid } = require("uuid");
const pg = require("../../libs/pg");
const { dirname } = require("path");

const create = async (req, res) => {
  try {
    const { info } = req.body;
    
    const imagename = `${uuid()}.png`;
    const pathimages = process.cwd() + "/uploads/" + imagename;
    
    await QRCode.toFile(`${pathimages}`, info, {
      color: {
        dark: "#3735a2",
        light: "#f8f9fa",
      },
    });
    
    const result = await pg(`insert into qrcodes(image) values($1)`, imagename);
    
    res.redirect("/qrcodedownload");
  } catch (error) {
    console.log(error.message);
  }
};

const downQrCode = async (req, res) => {
  const lastInsertedIdResult = await pg(
    `SELECT id FROM qrcodes ORDER BY id DESC LIMIT 1`
    );
    const lastInsertedId = lastInsertedIdResult[0].id;
    const Files = await pg(`SELECT * FROM qrcodes WHERE id = $1`, lastInsertedId);
    
    res.render("qrcode", { Files });
  };
  
  const qrscaner = async (req, res) => {
    res.render("qrcodescaner");
  };
  
  
  const qrscanner = async (req, res) => {
    try {
      const { image } = req.files;
       Jimp.read(image.data, function (err, image) {
        if (err) {
          console.error(err);
        }
        
        const qr = new QrCode();
        qr.callback = async function (err, value) {
          if (err) {
            console.error(err);
          }
          const datas = value.result
          
          const result = await pg(`insert into qrcoderesult(password) values($1)`, datas);

          const lastInsertedIdResult = await pg(
            `SELECT id FROM qrcoderesult ORDER BY id DESC LIMIT 1`
            );
            const lastInsertedId = lastInsertedIdResult[0].id;
            const Files = await pg(`SELECT * FROM qrcoderesult WHERE id = $1`, lastInsertedId);
            
          
          res.render("result", {Files})
        };
        qr.decode(image.bitmap);
      });
    } catch (error) {
      console.log("Error:", error.message);
    }
  };
  
  


const homePage = async (req, res) => {
  res.render("index");
};

module.exports = { homePage, qrscaner, qrscanner, create, downQrCode };
