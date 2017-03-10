tests({
    'It should be attached to global scope.': function() {
        assert(librarySystem, 'Library system not attached to global scope.');
    },
    'It should load libraries.': function() {
        debugger;
        var first = librarySystem('one', [], function() {
            return 'one';
        });
        var second = librarySystem('two', [], function() {
            return 'two';
        });
        eq(typeof first, 'object');
        eq(typeof second, 'object');
    },
    'If only libraryName argument it should return that library.': function() {
        librarySystem('libraryName', [], function() {
            return 'libraryName';
        });
        var result = librarySystem('libraryName');
        eq(result, 'libraryName');
    },
    'It should load library with dependencies.': function() {
        librarySystem('three', [], function() {
            return 'three';
        });
        librarySystem('four', [], function() {
            return 'four';
        });
        librarySystem('main', ['three', 'four'], function(three, four) {
            return three + ' ' + four;
        });
        var result = librarySystem('main');
        eq(result, 'three four');
    },
    'It should store multiple libraries.': function() {
        librarySystem('five', [], function() {
            return 'five';
        });
        librarySystem('six', [], function() {
            return 'six';
        });
        librarySystem('seven', [], function() {
            return 'seven';
        });
        eq(librarySystem('five'), 'five');
        eq(librarySystem('six'), 'six');
        eq(librarySystem('seven'), 'seven');
    },
    'It should call a library with other libraries passed in as dependencies.': function() {
        librarySystem('eight', [], function() {
            return 'eight';
        });
        librarySystem('nine', [], function() {
            return 'nine';
        });
        librarySystem('differentName', ['eight', 'nine'], function(eight, nine) {
            return eight + ' ' + nine;
        });

        var result = librarySystem('differentName');
        eq(result, 'eight nine');
    },
    'It should be able to load libraries out of order.': function() {
        librarySystem('differentLibrary', ['primary', 'secondary'], function(primary, secondary) {
            return primary + ' ' + secondary;
        });
        librarySystem('primary', [], function() {
            return 'primary';
        });
        librarySystem('secondary', [], function() {
            return 'secondary';
        });

        var result = librarySystem('differentLibrary');
        eq(result, 'primary secondary');

        librarySystem('anotherLibrary', ['uno', 'dos'], function(uno, dos) {
            return uno + ' ' + dos;
        });
        librarySystem('uno', [], function() {
            return 'uno';
        });
        librarySystem('dos', [], function() {
            return 'dos';
        });

        var result = librarySystem('anotherLibrary');
        eq(result, 'uno dos');
    },
    'It should run callback function only once.': function() {
        var iteration = 0;
        librarySystem('finalLibrary', ['once', 'twice'], function(once, twice) {
            iteration++;
            return once + ' ' + twice;
        });
        librarySystem('once', [], function() {
            return 'once';
        });
        librarySystem('twice', [], function() {
            return 'twice';
        });
        librarySystem('finalLibrary');
        librarySystem('finalLibrary');
        librarySystem('finalLibrary');
        librarySystem('finalLibrary');
        eq(iteration, 1);
    }
});
