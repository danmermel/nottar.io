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
    profile: null,
    nottarioHistory: null,
    contractAddress: null,
    web3Missing: false,
    animate: false,
    upload_visible: false,
    blockstack_enabled: false,
    dragging: false
  },
  mounted: function () {
    setTimeout(function () {
      //console.log('here', web3.eth.accounts, web3.eth.accounts.length);
      if (typeof window.ethereum === 'undefined') {
        app.web3Missing = true;
      }
    }, 1000);

    $.ajax({  //see if blockstack is there
      url: "http://localhost:6270/v1/ping"
    }).done(function (data) {
      console.log("here", data);
      app.blockstack_enabled = true;
      app.viewHistory();
    });

    if (blockstack.isUserSignedIn()) {
      this.profile = blockstack.loadUserData().profile
      console.log("Profile is", this.profile)
    } else if (blockstack.isSignInPending()) {
      blockstack.handlePendingSignIn().then(function (userData) {
        window.location = window.location.origin
      })
    }

  },
  methods: {
    about: function () {
      window.location.href = "about.html";
    },
    contact: function () {
      window.location.href = "contact.html";
    },
    viewHistory: function () {
      app.loadHistory(function (data) {
        app.nottarioHistory = data;
      });
    },
    loadHistory: function (callback) {
      blockstack.getFile('nottario.json', true).then(function (data) {
        callback(JSON.parse(data));
      }).catch(function (err) {
        callback([]);;
      });
    },
    saveHistory: function (callback) {
      var obj = {
        hash: app.hash,
        name: app.name,
        type: app.type,
        timestamp: new Date().getTime(),
        contractAddress: app.contractAddress
      };
      app.loadHistory(function (data) {
        data.push(obj);
        blockstack.putFile('nottario.json', JSON.stringify(data), true).then(function () {
          callback();
        }).catch(function (e) {
          console.log('history write fail', e);
          callback();
        });
      });
    },
    login: function () {
      blockstack.redirectToSignIn()
    },
    logout: function () {
      blockstack.signUserOut(window.location + "?logout");
      app.profile = null;
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

      if (accounts.length === 0) {
        alert("No Ethereum account found - please log into MetaMask");
        return;
      }
      app.error = "";

      console.log("creating contract, with", accounts[0]);
      var nottarioContract = new web3.eth.Contract(abi);
      var nottario = await nottarioContract.deploy({
        data: bin,
        arguments:[this.hash, this.name, this.type, this.size, this.lastModified] 
      	}).send({
          from: accounts[0], gas: 600000, value: 10000000000000000
        })

      console.log("The contract is ", nottario)
      /*
                if (data.address) {
                    //do nothing
                } else {  //poll for the transaction receipt every 2 secs until you get a contract address
                  app.tx = data.transactionHash;
                  setInterval(function(){
                    web3.eth.getTransactionReceipt(app.tx , function(err,d){    //while  the tx has not been mined the tx receipt is null
                      if(!err && d != null && d.contractAddress) {   
                        if (app.blockstack_enabled) {
                          app.contractAddress = d.contractAddress;
                          app.saveHistory(function() {
                            window.location = 'contract.html#' + d.contractAddress;
                          });
                        } else {
                          window.location = 'contract.html#' + d.contractAddress; 
                        }  //else
                      } //if
                    });  //web3 get Transaction
                  }, 2000);  // set Interval
                  app.animate = true;
                  app.etherscanLink = "https://etherscan.io/tx/" + app.tx;
                } //else

    }
  });
        // `event` is the native DOM event
*/
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

function showProfile(profile) {
  var person = new blockstack.Person(profile)
  document.getElementById('heading-name').innerHTML = person.name() ? person.name() : "Nameless Person"
  if (person.avatarUrl()) {
    document.getElementById('avatar-image').setAttribute('src', person.avatarUrl())
  }
  document.getElementById('section-1').style.display = 'none'
  document.getElementById('section-2').style.display = 'block'
}

