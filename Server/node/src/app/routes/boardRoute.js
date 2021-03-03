module.exports = function(app){
    const board = require('../controllers/boardController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    app.get('/app/board', board.getBoard); // apt.get으로 접근하게 된다면 board의 selectBoard가 명시가 됩니다. 
};
