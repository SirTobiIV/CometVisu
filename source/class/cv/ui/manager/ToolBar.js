/**
 *
 */
qx.Class.define('cv.ui.manager.ToolBar', {
  extend: qx.ui.toolbar.ToolBar,

  /*
  ***********************************************
    CONSTRUCTOR
  ***********************************************
  */
  construct: function (menuBar, uploadManager) {
    this.base(arguments);

    this._menuBar = menuBar;
    this._menuButtonConfig = menuBar.getButtonConfiguration();
    this._uploadManager = uploadManager;

    this._init();
  },

  /*
  ***********************************************
    EVENTS
  ***********************************************
  */
  events: {
    'reload': 'qx.event.type.Event'
  },

  /*
  ***********************************************
    PROPERTIES
  ***********************************************
  */
  properties: {
    appearance: {
      refine: true,
      init: 'cv-toolbar'
    },

    folder: {
      check: 'cv.ui.manager.model.FileItem',
      nullable: true,
      apply: '_applyFolder'
    },

    file: {
      check: 'cv.ui.manager.model.FileItem',
      nullable: true,
      apply: '_applyFile',
      event: 'changeFile'
    }
  },

  /*
  ***********************************************
    MEMBERS
  ***********************************************
  */
  members: {
    _menuButtonConfig: null,
    _uploadManager: null,
    _menuBar: null,

    _init: function () {
      if (!this._uploadManager) {
        this._uploadManager = new cv.ui.manager.upload.UploadMgr();
      }

      var fileController = cv.ui.manager.control.FileController.getInstance();

      var newButton = new qx.ui.toolbar.MenuButton(null,
        cv.theme.dark.Images.getIcon('new-file', 15),
        this._menuBar.getChildControl('new-menu')
      );
      var upload = this._createButton('upload');
      this._uploadManager.addWidget(upload);
      var deleteSelection = this._createButton('delete');
      deleteSelection.addListener('execute', function () {
        fileController.delete(this.getFile());
      }, this);

      var download = new qx.ui.toolbar.Button(null, cv.theme.dark.Images.getIcon('download', 15));
      download.setAppearance('cv-toolbar-button');
      download.setToolTipText(qx.locale.Manager.tr('Download'));
      download.addListener('execute', function () {
        fileController.download(this.getFile());
      }, this);
      // download button is only enabled when a file is selected
      this.bind('file', download, 'enabled', {
        converter: function (file) {
          return !!file && file.getType() === 'file' && !file.isFake();
        }
      });
      this.bind('file', deleteSelection, 'enabled', {
        converter: function (file) {
          return !!file && file.isWriteable() && !file.isFake();
        }
      });

      // config check
      var checkConfig = new qx.ui.toolbar.Button(null, cv.theme.dark.Images.getIcon('validate', 15));
      checkConfig.setAppearance('cv-toolbar-button');
      checkConfig.setToolTipText(qx.locale.Manager.tr('Validate'));
      checkConfig.addListener('execute', function () {
        fileController.validate(this.getFile());
      }, this);

      // validate button is only enabled when a file is selected
      this.bind('file', checkConfig, 'enabled', {
        converter: function (file) {
          return !!file && file.isConfigFile();
        }
      });

      var reload = new qx.ui.toolbar.Button(null, cv.theme.dark.Images.getIcon('reload', 15));
      reload.setAppearance('cv-toolbar-button');
      reload.setToolTipText(qx.locale.Manager.tr('Reload'));
      reload.addListener('execute', function () {
        this.fireEvent('reload');
      }, this);

      var createPart = new qx.ui.toolbar.Part();
      createPart.set({
        marginLeft: 0
      });
      createPart.add(newButton);
      createPart.add(upload);
      createPart.add(download);
      this.add(createPart);

      this.add(checkConfig);
      this.add(deleteSelection);

      this.add(new qx.ui.core.Spacer(), {flex: 1});
      this.add(reload);
    },

    _createButton: function (name) {
      var args = this._menuButtonConfig[name].args;
      var button = new qx.ui.toolbar.Button(null, args[1].replace(/\/[0-9]+$/, '/15'), args[2]);
      button.setAppearance('cv-toolbar-button');
      button.setToolTipText(args[0]);
      return button;
    },

    _applyFile: function () {

    },

    _applyFolder: function () {

    }
  },

  /*
  ***********************************************
    DESTRUCTOR
  ***********************************************
  */
  destruct: function () {
    this._menuButtonConfig = null;
    this._uploadManager = null;
    this.__menuBar = null;
  }
});
