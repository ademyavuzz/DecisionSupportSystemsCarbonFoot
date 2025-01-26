const express = require('express');
const router = express.Router();
const controller = require('../controllers/api_controller');

router.get('/getProducts', controller.getProducts);
router.get('/getTotalProductQuantity', controller.getTotalProductQuantity);
router.get('/getTotalProduct', controller.getTotalProductQuantity);
router.get('/getProductivity', controller.getProductivity);
router.get('/getShiftProductivity', controller.getShiftProductivity);
router.get('/getShiftProductivity2', controller.getShiftProductivity2);
router.get('/getTotalProductSell', controller.getTotalProductSell);
router.get('/getProductionQuantityPeriod', controller.getProductionQuantityPeriod);
router.get('/getMaxProductionLine', controller.getMaxProductionLine);
router.get('/getEnergyTour', controller.getEnergyTour);
router.get('/getEnergyMonth', controller.getEnergyMonth);
router.get('/getEnergyProductionData', controller.getEnergyProductionData);

module.exports = router;