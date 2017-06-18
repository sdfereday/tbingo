define(['config'], function(config) {

    let _data = {};

    // App Data allows for a global view on the state of the game data
    let appData = {
        set: function(name, data) {
            _data[name] = data;
        },
        get: function(name) {
            return _data[name];
        },
        update: function(name, data) {
            if(appData.get(name)) {
                appData.set(name, data);
            }
        }
    };

    return appData;

});