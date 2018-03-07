function fooBar(n) {
    for( let i = 1; i <= n; i++) {
        let foobar = '';
        if( i%3 && i%5 ) {
          console.log( i ); 
          continue;
        }

        if( i%3 === 0 ) foobar += 'Foo';
        if( i%5 === 0 ) foobar += 'Bar';
        console.log(foobar);
    }
}
fooBar(20);
