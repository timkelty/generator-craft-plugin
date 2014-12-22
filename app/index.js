'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var path = require('path');
var fs = require('fs');
var renamer = require('renamer');

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the stunning ' + chalk.red('Craft plugin') + ' generator!'
    ));

    var handleDefault = function(answers) {
      return this._.classify(answers.pluginName);
    };

    var prompts = [
      {
        type: 'input',
        name: 'pluginName',
        message: 'Plugin name (e.g. My Plugin)',
        default: this.appname
      },
      {
        type: 'input',
        name: 'pluginHandle',
        message: 'Plugin handle (e.g. MyPlugin)',
        default: handleDefault.bind(this)
      },
      {
        type: 'input',
        name: 'pluginVersion',
        message: 'Intial version number',
        default: '1.0.0'
      },
      {
        type: 'input',
        name: 'pluginDir',
        message: 'Craft plugin directory',
        default: 'craft/plugins',
      },
      {
        type: 'confirm',
        name: 'useComposer',
        message: 'Would you like to use Composer?',
        default: true
      },
      {
        type: 'input',
        name: 'developerName',
        message: 'Developer Name',
        store: true,
      },
      {
        type: 'input',
        name: 'developerUrl',
        message: 'Developer URL',
        store: true,
      }
    ];

    this.prompt(prompts, function (props) {

      for (var prop in props) {
        this[prop] = props[prop];
      }

      // For directory, NPM, Composer
      this.pluginHandleLower = props.pluginHandle.toLowerCase();
      this.pluginHandleSlugged = this._.slugify(props.pluginHandle);

      done();
    }.bind(this));
  },

  writing: {
    pluginFiles: function () {
      console.log(this);

      var pluginDest = path.join(this.pluginDir, this.pluginHandleLower);
      var generator = this;

      fs.exists(pluginDest, function (exists) {
        if (exists) {
          generator.log(chalk.red('Cannot proceed. A plugin folder already exists at: ') + pluginDest);
          process.exit();
        }
      });

      this.fs.copy(
        this.templatePath('editorconfig'),
        this.destinationPath(path.join(pluginDest, '.editorconfig'))
      );
      this.fs.copy(
        this.templatePath('_package.json'),
        this.destinationPath(path.join(pluginDest, 'package.json')),
        this
      );
      this.fs.copy(
        this.templatePath('_composer.json'),
        this.destinationPath(path.join(pluginDest, 'composer.json')),
        this
      );
      this.fs.copyTpl(
        this.templatePath('pluginhandle/**/*'),
        this.destinationPath(pluginDest),
        this
      );
    },
  },

  install: function () {
    var pluginDest = path.join(this.pluginDir, this.pluginHandleLower);
    var results = renamer.replace({
      regex: true,
      find: '^PluginHandle(.*)',
      replace: this.pluginHandle + '$1',
      files: renamer.expand(path.join(pluginDest, '**', '*')).files,
    });
    var generator = this;
    renamer.rename(results).list.forEach(function(file) {
      if (file.renamed) {
        generator.log(chalk.green('rename ') + file.before + ' => ' + file.after);
      }
    });

    if (this.useComposer) {
      this.spawnCommand('composer', ['install']);
    }
  }
});
