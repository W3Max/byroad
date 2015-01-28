/*jshint onevar:false */

//for node
var urlParser = urlParser || require('../../dist/url-parser');
//end node



describe('urlParser.toString() and route.toString()', function(){

    afterEach(function(){
        urlParser.resetState();
        urlParser.removeAllRoutes();
    });



    it('should help debugging', function(){
        var count = 0, requests = [];
        var a = urlParser.addRoute('/{foo}_{bar}');
        a.matched.add(function(foo, bar){
            expect(null).toEqual('fail: not a trigger test');
        });
        expect( urlParser.toString() ).toBe( '[urlParser numRoutes:1]' );
        expect( a.toString() ).toBe( '[Route pattern:"/{foo}_{bar}"]' );
    });


});
