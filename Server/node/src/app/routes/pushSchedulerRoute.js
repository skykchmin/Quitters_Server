module.exports = function(app){
    const pushScheduler = require('../controllers/pushSchedulerController');
    const cron = require('node-cron');
    
    cron.schedule('*/1 * * * *', pushScheduler.updatePausePush, {
        timezone: "Asia/Seoul"
    }); // 일시정지 체크

    cron.schedule('*/1 * * * *', pushScheduler.updateSilencePushOn, {
        timezone: "Asia/Seoul"
    }); // 방해금지 푸시알람 ON

    cron.schedule('*/1 * * * *', pushScheduler.updateSilencePushOff, {
        timezone: "Asia/Seoul"
    }); // 방해금지 푸시알람 OFF

};