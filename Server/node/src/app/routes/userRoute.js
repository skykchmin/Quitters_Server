module.exports = function(app){
    const user = require('../controllers/userController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    app.route('/users').post(user.signUp);
    app.route('/login').post(user.signIn);

    app.patch('/users/profiles',jwtMiddleware,user.changeProfile);
    app.get('/users',jwtMiddleware,user.getProfile);

    app.patch('/users-id',jwtMiddleware,user.changeId);
    app.patch('/users-password',jwtMiddleware,user.changePasswordInfo);
    app.patch('/users',jwtMiddleware,user.deleteUser);

    app.patch('/users/device-token',jwtMiddleware,user.setDeviceToken);

    app.get('/users/push',jwtMiddleware,user.getUserPush);

    app.get('/check', jwtMiddleware, user.check);
    app.get('/test',user.test);
};