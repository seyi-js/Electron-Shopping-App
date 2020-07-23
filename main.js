const {app, BrowserWindow,Menu , ipcMain} = require( 'electron' )
const url = require( 'url' );
const path = require( 'path' );

// SET ENV

process.env.NODE_ENV = 'production'

// const { app, BrowserWindow,Menu } = electron;

//First Window
let mainWindow;
let addWindow;


//Listen For App Ready
app.on( 'ready', () => {
    //Create New Window
    mainWindow = new BrowserWindow( {
        webPreferences: {
            nodeIntegration: true
          },
    } );
    //Load html into window
    mainWindow.loadURL( url.format( {
        pathname: path.join( __dirname, 'mainWindow.html' ),
        protocol: 'file:',
        slashes: true
    } ) );

    //Quit app When Closed
    mainWindow.on( 'closed', () => {
        app.quit();
    })
    //Build Menu From Template
    const mainMenu = Menu.buildFromTemplate( mainWindowMenu );

    //InsertMenu
    Menu.setApplicationMenu( mainMenu );

} );


// Handle create add window
const createAddWindow = () => {
    addWindow = new BrowserWindow( {
        
        width: 300,
        height: 200,
        title: 'Add Shopping Item',
        webPreferences: {
            nodeIntegration: true
          },
        
    } );
    //Load html into window
    addWindow.loadURL( url.format( {
        pathname: path.join( __dirname, 'addWindow.html' ),
        protocol: 'file:',
        slashes: true
    } ) );
    //Garbage Collection handle
    addWindow.on( 'close', () => {
        addWindow = null
    })
}


//Catch Item Add
ipcMain.on( 'item:add', ( e, item ) => {
    
    mainWindow.webContents.send( 'item:add', item );
    addWindow.close();
})

//Menu Template

const mainWindowMenu = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Add Item',
                click() {
                    createAddWindow();
                }
            },
            {
                label: 'Clear Items ',
                click() {
                    mainWindow.webContents.send('item:clear')
                }
            },

            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click() {
                    app.quit();
                }
            }
        ]
    }
];


// if mac, add empty object to menu

if ( process.platform == 'darwin' ) {
    mainWindowMenu.unshift( {} );
}


//Add Dev tools if not in production

if ( process.env.NODE_ENV !== 'production' ) {
    mainWindowMenu.push( {
        label: 'Developer Tools',
        submenu: [
            {
                label: 'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click( item, focusedWindow ) {
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    })
}