module.exports = function(app){
    const challengecertification = require('../controllers/challengecertificationController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    app.get('/challenges/certification/:challengeIdx/:timeNumber', challengecertification.getChallengeCertification); // 
    app.patch('/challenges/certification/:challengeIdx/:observerIdx/:timeNumber', challengecertification.patchChallengeCertification); // 사용자 입력에 따른 상태변화
    
    // app.get('/challenges/test', challengecertification.updateChallengeParticipation); // 감시자 참여 중단
    // app.get('/challenges/test/:observerIdx', challengecertification.updateChallengeParticipation); // 감시자 참여 중단 - 테스트용
    // app.get('/check', jwtMiddleware, user.check);
};