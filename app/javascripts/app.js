import "../stylesheets/app.css";
import "./menu.js"
import "./blog_contents.js"

import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

import metacoin_artifacts from '../../build/contracts/MetaCoin.json'

var DAppLog= contract(metacoin_artifacts);

var accounts;
var account;

window.App = {
  start: function() {
    var self = this;
    DAppLog.setProvider(web3.currentProvider);
    self.refreshBlogContent();

    web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        $("#metamask_alert").show();
        return;
      }
      if (accs.length == 0) {
        $("#metamask_alert").show();
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

  refreshBlogContent: function(blogId, createFlag) {
    var self = this;

    var meta;
    DAppLog.deployed().then(function(instance) {
      meta = instance;
      if (blogId == undefined){
        return false
      }
      return meta.getBlog.call(blogId, {from: account});
    }).then(function(value) {
      if (value != false){
        var blogContent = value.valueOf();
        if (createFlag == true) {
          var titleElement = document.getElementById("titleCreateElement");
          var bodyElement = document.getElementById("bodyCreateElement");
        } else {
          var writerElement = document.getElementById("writerElement");
          writerElement.innerHTML = blogContent[1];
          var titleElement = document.getElementById("titleElement");
          var bodyElement = document.getElementById("bodyElement");
        }
        titleElement.innerHTML = blogContent[2];
        bodyElement.innerHTML = blogContent[3];
      }
    }).catch(function(e) {
      console.log(e);
      self.setStatus("エラーが発生しまています");
    });
  },

  sendBlog: function() {
    var self = this;
    var title = document.getElementById("title").value;
    var body = document.getElementById("body").value.replace(/\r?\n/g, '<br>');
    var meta;
    var counter;

    this.setStatus("作成中...");

    DAppLog.deployed().then(function(instance) {
      meta = instance;
      return meta.getBlogsCount.call({from: account});
    }).then(function(blogCount) {
        counter = blogCount;
        return meta.sendBlog(counter, title, body, {from: account});
      }).then(function(value) {
        self.setStatus("作成完了。作成内容は以下の通りです。");
        self.refreshBlogContent(counter, true);
      }).catch(function(e) {
        console.log(e);
        self.setStatus("作成中にエラーが発生しました");
    }).catch(function(e) {
      console.log(e);
      self.setStatus("作成中にエラーが発生しました");
    });
  },
};

function getBlogsCounter() {
  DAppLog.deployed().then(function(instance) {
    return instance.getBlogsCount.call({from: account});
  }).then(function(value){
      var counter = Number(value.valueOf());
      displayBlogList(counter);
  });
}

function displayBlogList(blogCounter){
  DAppLog.deployed().then(function(instance) {
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
    console.warn("Using web3 detected from external source. :) ")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development.");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"));
  }
  App.start();
});

DAppLog.setProvider(web3.currentProvider);
getBlogsCounter();
