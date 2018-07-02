// Copyright (c) 2018 Ricardo Marques
//
// GNU GENERAL PUBLIC LICENSE
//    Version 2, June 1991
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation; either version 2
// of the License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.

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
let coinConversion = [];
let settingFixed = [];
let _httpSession;

const helloWorldIndicator = new Lang.Class({
  Name: 'helloWorldIndicator', Extends: PanelMenu.Button,

  _init: function (){
    this.parent(0.0, "Cryptocurrency Indicator", false);
    this.buttonText = new St.Label({text: ("Loading...")});
    this.actor.add_actor(this.buttonText);

    this._readSetingsFile();
    this._refresh();
    //global.log("RM_LOG: FLAG_03");
  },

  _readSetingsFile: function(){
    let userName = GLib.spawn_command_line_sync("id -u -n")[1].toString().replace('\n', '');
    //global.log(GLib.spawn_command_line_sync("cat /home/"+userName+"/.local/share/gnome-shell/extensions/cryptoTicker@Ricx8/settings.conf")[1].toString());
    let settingsData = JSON.parse(GLib.spawn_command_line_sync("cat /home/"+userName+"/.local/share/gnome-shell/extensions/cryptoTicker@Ricx8/settings.conf")[1].toString());//.split('\n');

    let line;
    for (line=0; line<settingsData.length; line++){
      let currentCoin = settingsData[line]["coin"];
      let currentFixVal = settingsData[line]["toFixed"];

      /*if (line == 0){
        coinConversion = currentCoin;
      }*/
      if (line > 0){
        //this.menu.addMenuItem(new PopupMenu.PopupSwitchMenuItem(currentCoin, true));
        this.menu.addMenuItem(new PopupMenu.PopupMenuItem(currentCoin));
      }

      coinConversion.push(currentCoin);
      settingFixed.push(currentFixVal);
    }

  },

  _refresh: function () {
    this._getDataFromBinance(this._refreshUI);
    this._removeTimeout();
    this._timeout = Mainloop.timeout_add_seconds(10, Lang.bind(this, this._refresh));
    return true;
  },

  _getDataFromBinance: function () {
    let params = {
      //symbol: coinConversion[0]
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
    let listOfUIs = this.menu._getMenuItems();
    //global.log(data.toSource());
    //this.buttonText.set_text(data["symbol"]+"::"+parseFloat(data["price"]).toFixed(settingFixed[0]));
    let i;
    for (i=0; i<data.length; i++){
      //global.log("RM-LOG: "+data[i]["symbol"]+"/"+data[i]["price"]);
      if (coinConversion[0] == data[i]["symbol"]){
        this.buttonText.set_text(data[i]["symbol"]+"::"+parseFloat(data[i]["price"]).toFixed(settingFixed[0]));
      }
      else{
        let nUI;
        for (nUI=0; nUI<listOfUIs.length; nUI++){
          if (coinConversion[nUI+1] == data[i]["symbol"]){
            let tmpCurrentLabel;

            if (settingFixed[nUI+1] == "default") tmpCurrentLabel = data[i]["symbol"]+"::"+parseFloat(data[i]["price"]);
            else tmpCurrentLabel = data[i]["symbol"]+"::"+parseFloat(data[i]["price"]).toFixed(settingFixed[nUI+1]);

            listOfUIs[nUI].label.set_text(tmpCurrentLabel);
          }
        }
      }
    }
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
