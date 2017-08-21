const BaseRouter = require('../BaseRouter.js');
const UsersController = require('../../controllers/UsersController.js');

const ROUTE = "users";

class UsersRouter extends BaseRouter {

    constructor() {
        super(ROUTE);
        this.usersController = new UsersController();

        this.router.get('/', this.usersController.getAllUsers.bind(this.usersController));
        this.router.post('/', this.usersController.createUser.bind(this.usersController));

        this.router.get('/:id', this.usersController.getUserById.bind(this.usersController));
        this.router.put('/:id', this.usersController.replaceOrCreateUser.bind(this.usersController));
        this.router.patch('/:id', this.usersController.updateOrCreateUser.bind(this.usersController));
        this.router.delete('/:id', this.usersController.deleteUserById.bind(this.usersController));
    }

}

module.exports = UsersRouter;
