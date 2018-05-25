  function createBlogTable(){
    var counter;
    counter = App.getAllBlogs();
    console.log(counter);
/*
    for (var i=1; i=<blogCount, i++) {
      var blog_contents = refreshBlogContent(i);
      addBlogAtTable(blog_contents);
    }
*/
  }
  // Blog数をgetする
  function test(){
    var meta;
    MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.getBlogsCount.call({from: account});
    }).then(function(value) {
      var return_value  = value.valueOf();
      console.log(return_value);
      return return_value;
    }).catch(function(e) {
      console.log(e);
      alert("エラーが発生しました。");
    });
  }


