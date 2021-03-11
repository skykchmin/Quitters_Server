module.exports = function(app){
    const jwtMiddleware = require('../../../config/jwtMiddleware');
    const cron = require('node-cron');
    const certificationscheduler = require('../controllers/certificationschedulerController');

    cron.schedule('0 0-23/4 1-31 * *', certificationscheduler.updateChallengeParticipation); // 

    // cron.schedule('0-59/1 * 1-31 * *', certificationscheduler.updateChallengeParticipation); // 테스트용
    // app.get('/check', jwtMiddleware, user.check);
};