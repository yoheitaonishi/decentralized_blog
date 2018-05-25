import "../stylesheets/app.css";
import "./menu.js"
import "./blog_contents.js"

import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

import metacoin_artifacts from '../../build/contracts/MetaCoin.json'

var MetaCoin = contract(metacoin_artifacts);

var accounts;
var account;

window.App = {
  start: function() {
    var self = this;

    MetaCoin.setProvider(web3.currentProvider);
    self.refreshBlogContent();

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
        self.refreshBlogContent(counter);
        // TODO:登録できたコンテンツを表示させる
      }).catch(function(e) {
        console.log(e);
        self.setStatus("更新中にエラーが発生しました");
    }).catch(function(e) {
      console.log(e);
      self.setStatus("更新中にエラーが発生しました");
    });
  },

};



// Blog数をgetする
function getBlogsCounter() {
  MetaCoin.deployed().then(function(instance) {
    return instance.getBlogsCount.call({from: account});
  }).then(function(value){
      var counter = Number(value.valueOf());
      displayBlogList(counter);
  });
}

function displayBlogList(blogCounter){
  MetaCoin.deployed().then(function(instance) {
    for (var i=1; i<blogCounter; i++) {
      instance.getBlog.call(i, {from: account}).then(function(value){
        addBlogAtTable(value);
      });
    }
  });
}

function addBlogAtTable(blogArray){
  if ('content' in document.createElement('template')) {
  
    var t = document.querySelector('#blog_row'),
    td = t.content.querySelectorAll("td");
    td[0].textContent = blogArray[0];
    td[1].textContent = blogArray[1];
    td[2].textContent = blogArray[2];

    var read_button = td[3].querySelector("input");
    read_button.id = Number(blogArray[0]);
  
    var tb = document.querySelector("tbody");
    var clone = document.importNode(t.content, true);
    tb.appendChild(clone);

    
  } else {
    // IEはテンプレート見対応
  }
}

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

MetaCoin.setProvider(web3.currentProvider);
getBlogsCounter();

