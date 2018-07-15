#!/usr/bin/gjs

imports.gi.versions.Gtk = '3.0'
const Gtk = imports.gi.Gtk;
const GObject = imports.gi.GObject;

class Application {

    //create the application
    constructor() {
        this.application = new Gtk.Application();

       //connect to 'activate' and 'startup' signals to handlers.
       this.application.connect('activate', this._onActivate.bind(this));
       this.application.connect('startup', this._onStartup.bind(this));
    }

    //create the UI
    _buildUI() {
        this._window = new Gtk.ApplicationWindow({
          application: this.application,
          border_width: 10,
          title: "CryptoTicker"
        });
        this._window.set_default_size(400, 400);

        // Create a Grid
        this.mainGrid = new Gtk.Grid ({
          column_homogeneous: true,
          column_spacing: 20,
          row_spacing: 20
        });

        // Make the pulldowm for all the coins
        this.tickerPullDowm = new Gtk.ComboBoxText();
        let tickerList = ["BTCUSDT", "BTCADA"];
        for (let i=0; i<tickerList.length; i++){
          this.tickerPullDowm.append_text(tickerList[i]);
        }
        this.tickerPullDowm.set_active(0);

        // Label for "fix value"
        this.fixVLabel = new Gtk.Label({ label: "Fix value",  margin_left: 50});
        this.fixVEntry = Gtk.SpinButton.new_with_range (0, 10, 1);

        this.addButton = new Gtk.Button ({label: "Add ticker"});
        this.removeButton = new Gtk.Button ({label: "-"});
        this.SaveButton = new Gtk.Button ({label: "Save changes"});


        // Create the underlying liststore for the tickers
        this.tickerListListStore = new Gtk.ListStore ();
        this.tickerListListStore.set_column_types ([
          GObject.TYPE_STRING
        ]);

        // Create the treeview
        this.tickerListUI = new Gtk.TreeView ({
          expand: true,
          model: this.tickerListListStore
        });

        let tickerCol = new Gtk.TreeViewColumn ({ title: "Ticker" });

        this.mainGrid.attach(this.tickerPullDowm,  0, 0, 1, 1);
        this.mainGrid.attach(this.fixVLabel, 1, 0, 1, 1);
        this.mainGrid.attach(this.fixVEntry, 2, 0, 1, 1);
        this.mainGrid.attach(this.addButton, 3, 0, 1, 1);
        this.mainGrid.attach(this.tickerListUI, 0, 1, 4, 1);
        this.mainGrid.attach(this.removeButton, 0, 2, 1, 1);
        this.mainGrid.attach(this.SaveButton, 3, 2, 1, 1);


        this._window.add(this.mainGrid)

        //this.label = new Gtk.Label({ label: "Hello World" });
        //this._window.add(this.label);
    }

    //handler for 'activate' signal
    _onActivate() {
        //show the window and all child widgets
        this._window.show_all();
    }

    //handler for 'startup' signal
    _onStartup() {
        this._buildUI();
    }
};

//run the application
let app = new Application();
app.application.run(ARGV);
