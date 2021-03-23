module.exports = function(app){
    const challenge = require('../controllers/challengeController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    app.post('/challenges', challenge.insertChallenge); // 챌린지 생성
    app.patch('/challenges/challengeInfo/:challengeIdx', challenge.patchChallenge); // 챌린지 수정
    app.patch('/challenges/:challengeIdx', challenge.deleteChallenge); // 챌린지 삭제
    app.get('/main/:userIdx', challenge.getMain);
    app.get('/challenges/detail/:challengeIdx', challenge.getChallengeDetail); // 챌린지 상세 조회
    app.get('/challenges/failmessage/:challengeIdx', challenge.getChallengeFailMessage); // 챌린지 실패 사유 
    app.get('/challenges/mychallengelist/:userIdx', challenge.getMyChallengeListInfo); // 챌린지 목록 관리 - 나의 챌린지
    app.get('/challenges/friendchallengelist/:observerIdx', challenge.getFriendChallengeListInfo); // 챌린지 목록 관리 - 나의 챌린지
    // app.get('/check', jwtMiddleware, user.check);
};