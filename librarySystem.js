(function() {
    var libraryStorage = {};
    var dependenciesCache = [];

    function librarySystem(libraryName, dependencies, callback) {
        var isItLoaded = libraryStorage.hasOwnProperty(libraryName);
        var isItCached;

        if (arguments.length > 1 && !isItLoaded) {
            toolbox.loadLibrary(libraryName, dependencies, callback);
        }
        
        var isItCached = libraryStorage[libraryName].cached;

        if (arguments.length === 1 && !isItCached) {
            toolbox.cacheDependencies(libraryName);
            return libraryStorage[libraryName].callback.apply(this, dependenciesCache);
        }
        return libraryStorage[libraryName];
    }

    var toolbox = {
        cacheDependencies: function(libraryName) {
                var dependencies = libraryStorage[libraryName].dependencies;
                var dependenciesArray = [];

                dependencies.forEach(function(dependency) {
                    dependenciesArray.push(libraryStorage[dependency].callback());
                    libraryStorage[dependency].cached = true;
                });

                dependenciesCache = dependenciesArray;
                libraryStorage[libraryName].cached = true;
        },
        loadLibrary: function(libraryName, dependencies, callback) {
            libraryStorage[libraryName] = {
                'dependencies': dependencies,
                'callback': callback,
                'cached': false
            };
        }
    }
    window.librarySystem = librarySystem;
}());
