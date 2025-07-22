const {program} = require('commander');

program
    .command('register')
    .description('Registration new account')
    .action(require('./commands/register'));
program
    .command('login')
    .description('Login to your account')
    .action(require('./commands/login'));

program.command('logout').action(require('./commands/logout'));

program.parse();