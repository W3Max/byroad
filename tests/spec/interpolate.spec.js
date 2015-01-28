/*jshint onevar:false */

//for node
var urlParser = urlParser || require('../../dist/url-parser');
//end node



describe('Route.interpolate()', function(){

    afterEach(function(){
        urlParser.resetState();
        urlParser.removeAllRoutes();
    });


    it('should replace regular segments', function(){
        var a = urlParser.addRoute('/{foo}/:bar:');
        expect( a.interpolate({foo: 'lorem', bar: 'ipsum'}) ).toEqual( '/lorem/ipsum' );
        expect( a.interpolate({foo: 'dolor-sit'}) ).toEqual( '/dolor-sit' );
    });

    it('should allow number as segment (#gh-54)', function(){
        var a = urlParser.addRoute('/{foo}/:bar:');
        expect( a.interpolate({foo: 123, bar: 456}) ).toEqual( '/123/456' );
        expect( a.interpolate({foo: 123}) ).toEqual( '/123' );
    });

    it('should replace rest segments', function(){
        var a = urlParser.addRoute('lorem/{foo*}:bar*:');
        expect( a.interpolate({'foo*': 'ipsum/dolor', 'bar*': 'sit/amet'}) ).toEqual( 'lorem/ipsum/dolor/sit/amet' );
        expect( a.interpolate({'foo*': 'dolor-sit'}) ).toEqual( 'lorem/dolor-sit' );
    });

    it('should replace multiple optional segments', function(){
        var a = urlParser.addRoute('lorem/:a::b::c:');
        expect( a.interpolate({a: 'ipsum', b: 'dolor'}) ).toEqual( 'lorem/ipsum/dolor' );
        expect( a.interpolate({a: 'ipsum', b: 'dolor', c : 'sit'}) ).toEqual( 'lorem/ipsum/dolor/sit' );
        expect( a.interpolate({a: 'dolor-sit'}) ).toEqual( 'lorem/dolor-sit' );
        expect( a.interpolate({}) ).toEqual( 'lorem' );
    });

    it('should throw an error if missing required argument', function () {
        var a = urlParser.addRoute('/{foo}/:bar:');
        expect( function(){
            a.interpolate({bar: 'ipsum'});
        }).toThrow( 'The segment {foo} is required.' );
    });

    it('should throw an error if string doesn\'t match pattern', function(){
        var a = urlParser.addRoute('/{foo}/:bar:');
        expect( function(){
            a.interpolate({foo: 'lorem/ipsum', bar: 'dolor'});
        }).toThrow( 'Invalid value "lorem/ipsum" for segment "{foo}".' );
    });

    it('should throw an error if route was created by an RegExp pattern', function () {
        var a = urlParser.addRoute(/^\w+\/\d+$/);
        expect( function(){
            a.interpolate({bar: 'ipsum'});
        }).toThrow( 'Route pattern should be a string.' );
    });

    it('should throw an error if generated string doesn\'t validate against rules', function () {
        var a = urlParser.addRoute('/{foo}/:bar:');
        a.rules = {
            foo : ['lorem', 'news'],
            bar : /^\d+$/
        };
        expect( function(){
            a.interpolate({foo: 'lorem', bar: 'ipsum'});
        }).toThrow( 'Generated string doesn\'t validate against `Route.rules`.' );
    });

    it('should replace query segments', function(){
        var a = urlParser.addRoute('/{foo}/:?query:');
        expect( a.interpolate({foo: 'lorem', query: {some: 'test'}}) ).toEqual( '/lorem/?some=test' );
        expect( a.interpolate({foo: 'dolor-sit', query: {multiple: 'params', works: 'fine'}}) ).toEqual( '/dolor-sit/?multiple=params&works=fine' );
    });
});
