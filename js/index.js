//set up web3
var web3= new Web3(Web3.givenProvider)

var app = new Vue({
  el: '#app',
  data: {
    etherscanLink: "",
    hash: "",
    name: "",
    lastModified: "",
    size: "",
    type: "",
    error: "",
    tx: "",
    contractAddress: null,
    web3Missing: false,
    animate: false,
    upload_visible: false,
    dragging: false, 
    status: []
  },
  mounted: function () {
    setTimeout(function () {
      //console.log('here', web3.eth.accounts, web3.eth.accounts.length);
      if (typeof window.ethereum === 'undefined') {
        app.web3Missing = true;
      }
    }, 1000);

  },
  methods: {
    about: function () {
      window.location.href = "about.html";
    },
    contact: function () {
      window.location.href = "contact.html";
    },
    display_upload: function () {
      window.scrollTo(0, 0);
      app.upload_visible = true;
    },
    cancel_upload: function () {
      app.upload_visible = false;
      app.hash = "";
      app.name = "";
      app.lastModified = "";
      app.size = "";
      app.type = "";
      app.error = "";
      app.tx = "";
      app.animate = false
    },
    create_contract: async function () {
      // `this` inside methods points to the Vue instance
      var accounts = await web3.eth.getAccounts()
      console.log('accounts', accounts)
      if (accounts.length === 0) {
        alert("No Ethereum account found - please log into MetaMask");
        return;
      }
      app.error = "";
      app.animate = true
      console.log("creating contract, with", accounts[0]);
      console.log('arguements', [this.hash, this.name, this.type, this.size, this.lastModified])
      var nottarioContract = new web3.eth.Contract(abi);
      var address = ''
      var nottario = await nottarioContract.deploy({
        data: bin,
        arguments:[this.hash, web3.utils.utf8ToHex(this.name), web3.utils.utf8ToHex(this.type), this.size, this.lastModified] 
      	}).send({
          from: accounts[0], gas: 600000, value: 10000000000000000
        }).once('sending', function(payload){ console.log('sending', payload); app.status.push('sending transaction')
 })
          .once('sent', function(payload){ console.log('sent', payload); })
          .once('transactionHash', function(hash){ console.log('tx hash', hash); app.status.push('hash ' + hash)})
          .once('receipt', function(receipt){console.log('receipt', receipt); address = receipt.contractAddress; app.status.push('receipt ' + receipt.contractAddress) })
          .on('confirmation', function(confNumber, receipt, latestBlockHash){ console.log('confirmation', confNumber, receipt, latestBlockHash); app.status.push('confirmed') })
          .on('error', function(error){ console.log('error', error); app.error = error })

      console.log("The contract is ", nottario)
      window.location = 'contract.html#' + address;
      }
      
  }
})

function allowDrop(ev) {
  ev.preventDefault();
  app.dragging = true;
}

function dragout(ev) {
  console.log('drag out');
  app.dragging = false;
}

function drop_handler(ev) {
  console.log("Drop");
  ev.preventDefault();
  app.dragging = false;
  console.log('ev is', ev);
  var f = ev.dataTransfer.files[0];
  if (!f) {
    return alert('Cannot read file meta data');
  }
  console.log("the file is", f);
  app.lastModified = f.lastModified;
  app.name = f.name.substr(0, 32);
  app.size = f.size;
  app.type = f.type.substr(0, 32);
  var reader = new FileReader();
  reader.onload = function (event) {
    //console.log('onload!',event);
    app.hash = web3.utils.sha3(event.target.result);
    console.log("hash is " + app.hash);
  };
  reader.readAsText(f);
}


