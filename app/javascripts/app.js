// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import metacoin_artifacts from '../../build/contracts/MetaCoin.json'

// MetaCoin is our usable abstraction, which we'll use through the code below.
var MetaCoin = contract(metacoin_artifacts);

import "./bind.js";

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;

window.App = {
  start: function() {
    var self = this;
    var test;

    // Bootstrap the MetaCoin abstraction for Use.
    MetaCoin.setProvider(web3.currentProvider);
    self.refreshBlogContent();

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      accounts = accs;
      account = accounts[0];

    });
  },

  setStatus: function(message) {
    var status = document.getElementById("status");
    status.innerHTML = message;
  },

  refreshBlogContent: function(blogId) {
    var self = this;

    var meta;
    MetaCoin.deployed().then(function(instance) {
      meta = instance;
      if (blogId == undefined){
        return false
      }
      return meta.getBlog.call(blogId, {from: account});
    }).then(function(value) {
      if (value != false){
        var blogContent = value.valueOf();
        var blogIdElement = document.getElementById("blogIdElement");
        var writerElement = document.getElementById("writerElement");
        var titleElement = document.getElementById("titleElement");
        var bodyElement = document.getElementById("bodyElement");
        blogIdElement.innerHTML = blogContent[0];
        writerElement.innerHTML = blogContent[1];
        titleElement.innerHTML = blogContent[2];
        bodyElement.innerHTML = blogContent[3];
      }
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error getting balance; see log.");
    });
  },

  // Blog数をgetする
  getAllBlogs: function() {
    var meta;
    MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.getBlogsCount.call({from: account});
    }).then(function(value) {
      console.log(value);
      return value;
    }).catch(function(e) {
      console.log(e);
      alert("エラーが発生しました。");
    });
  }

  sendBlog: function() {
    var self = this;
    var title = document.getElementById("title").value;
    var body = document.getElementById("body").value;
    var meta;
    var counter;

    this.setStatus("更新中...");

    MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.getBlogsCount.call({from: account});
    }).then(function(blogCount) {
        counter = blogCount;
        return meta.sendBlog(counter, title, body, {from: account});
      }).then(function(value) {
        self.setStatus("更新完了");
        meta.getBlogsCount.call({from: account});
        console.log(value.valueOf());
        self.refreshBlogContent(counter);
        // TODO:登録できたコンテンツを表示させる
      }).catch(function(e) {
        console.log(e);
        self.setStatus("更新中にエラーが発生しました");
    }).catch(function(e) {
      console.log(e);
      self.setStatus("更新中にエラーが発生しました");
    });
  }

};

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"));
  }

  App.start();
});
