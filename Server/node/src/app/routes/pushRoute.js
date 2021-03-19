module.exports = function(app){
    const push = require('../controllers/pushController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    
    app.patch('/push/permission',jwtMiddleware,push.setPush);

    app.patch('/push/pause',jwtMiddleware,push.setPause);
    app.patch('/push/silence',jwtMiddleware,push.setSilence);

    app.patch('/push/silence-off',jwtMiddleware,push.setSilenceOff);

};