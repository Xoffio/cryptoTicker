const St = imports.gi.St;
const Main = imports.ui.main;
const Soup = imports.gi.Soup;
const Lang = imports.lang;
const Mainloop = imports.mainloop;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const gio = imports.gi.Gio;
const GLib = imports.gi.GLib;
//const Clutter = imports.gi.Clutter;
//const Gtk = imports.gi.Gtk;

let binanceURL = "https://api.binance.com/api/v3/ticker/price";
let coinConversion = "ADABTC";
let _httpSession;

const helloWorldIndicator = new Lang.Class({
  Name: 'helloWorldIndicator', Extends: PanelMenu.Button,

  _init: function (){
    this.parent(0.0, "Hello World Indicator", false);
    this.buttonText = new St.Label({text: ("Loading...")});
    this.actor.add_actor(this.buttonText);

    //this.menu.addMenuItem(new PopupMenu.PopupBaseMenuItem(""));

    this._readSetingsFile();
    this._refresh();
    global.log("RM_LOG: FLAG_03");
  },

  _readSetingsFile: function(){
    let userName = GLib.spawn_command_line_sync("id -u -n")[1].toString().replace('\n', '');
    let settingsData = JSON.parse(GLib.spawn_command_line_sync("cat /home/"+userName+"/.local/share/gnome-shell/extensions/ricardo@earth.com/settings.conf")[1].toString());//.split('\n');

    for (line=0; line<settingsData.length; line++){
      var currentCoin = settingsData[line]["coin"];

      if (line == 0){
        coinConversion = currentCoin;
      }
      else{
        this.menu.addMenuItem(new PopupMenu.PopupSwitchMenuItem(currentCoin, true));
      }

    }

  },

  _refresh: function () {
    global.log("RM_LOG: FLAG_01");
    this._getDataFromBinance(this._refreshUI);
    this._removeTimeout();
    this._timeout = Mainloop.timeout_add_seconds(10, Lang.bind(this, this._refresh));
    return true;
  },

  _getDataFromBinance: function () {
    let params = {
      symbol: coinConversion
    };

    _httpSession = new Soup.Session();
    let message = Soup.form_request_new_from_hash('GET', binanceURL, params);
    //message.request_headers.append("X-Authorization-key", TW_AUTH_KEY);
    _httpSession.queue_message(message, Lang.bind(this, function (_httpSession, message) {
      if (message.status_code !== 200)
        return;

      let json = JSON.parse(message.response_body.data);
      this._refreshUI(json);
    }));
  },

  _refreshUI: function (data) {
    //global.log(data.toSource());
    this.buttonText.set_text(data["symbol"]+"::"+parseFloat(data["price"]).toFixed(2));
  },

  _removeTimeout: function () {
    if (this._timeout) {
      Mainloop.source_remove(this._timeout);
      this._timeout = null;
    }
  },

  stop: function () {
    if (_httpSession !== undefined)
      _httpSession.abort();
    _httpSession = undefined;

    if (this._timeout)
      Mainloop.source_remove(this._timeout);
    this._timeout = undefined;

    this.menu.removeAll();
  }

    //Add first menu item, with action
    /*this.menu.addAction("First Menu Item", function(event) {
      Main.Util.trySpawnCommandLine('xdg-open https://github.com/Ricx8');
    });

    //Add second menu item, with no action
    this.menu.addMenuItem(new PopupMenu.PopupMenuItem("Second Menu Item"));

    //Add a separator
    this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());

    this.menu.addMenuItem(new PopupMenu.PopupSwitchMenuItem("Hello", true));

    //Add a submenu as the 3rd item, and submenu item with no action
    this.MySubMenu = new PopupMenu.PopupSubMenuMenuItem("SubMenu");
    this.menu.addMenuItem(this.MySubMenu);
    this.MySubMenu.menu.addMenuItem(new PopupMenu.PopupMenuItem("submenu value"));*/
});

let twMenu;

function init(){
}

function enable(){
  twMenu = new helloWorldIndicator;
  Main.panel.addToStatusArea('tw-indicator', twMenu);
}

function disable(){
  twMenu.destroy();
}
