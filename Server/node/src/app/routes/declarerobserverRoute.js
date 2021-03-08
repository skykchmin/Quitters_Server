module.exports = function(app){
    const declarerobserver = require('../controllers/declarerobserverController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    app.post('/challenges/:challengeIdx/participation/:observerIdx', declarerobserver.insertChallengeParticipation); // 챌린지 참여 코드
    app.patch('/challenges/:challengeIdx/participation/:observerIdx', declarerobserver.patchChallengeParticipation); // 챌린지 수정
    app.patch('/challenges/:challengeIdx/stop-participation/:observerIdx', declarerobserver.patchChallengeStopParticipation); // 감시자 참여 중단
    // app.get('/check', jwtMiddleware, user.check);
};