module.exports = function(app){
    const social = require('../controllers/socialController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    
    app.post('/users/kakao',social.getKakao);
    app.post('/users/google',social.getGoogle);

};