var app = new Vue({
  el: '#app',
  data: {
    hash:"",
    name:"",
    lastModified:"",
    size:"",
    type:"",
    error: "",
    web3Missing: false,
    loggedIn: true,
    animate: false,
    upload_visible: false
  },
  mounted:function(){
   setTimeout(function() {
      //console.log('here', web3.eth.accounts, web3.eth.accounts.length);
      if (typeof web3 === 'undefined') {
        app.web3Missing = true;
      } else {
        if (!web3.eth.accounts || web3.eth.accounts.length == 0) {
          app.loggedIn = false;
        }
      }
    },1000)
  },
  methods: {
    display_upload: function() {
      app.upload_visible = true;
    },
    cancel_upload: function() {
      app.upload_visible = false;
      app.hash = "";
      app.name = "";
      app.lastModified = "";
      app.size = "";
      app.type = "";
      app.error =  "";
      app.animate = false
   },
    create_contract: function () {
      // `this` inside methods points to the Vue instance
      console.log("creating contract, with", web3.eth.accounts[0]);
      var nottarioContract = web3.eth.contract(abi);
      var nottario =nottarioContract.new( "0x"+this.hash, this.name, this.type, this.size, this.lastModified, {from:web3.eth.accounts[0], data: bin, gas: 500000, value: 10000000000000000}, function(err,data) {
        console.log(err, data);
        if (err)  {
          app.error = err;
        } else {
          if (data.address) {
            window.location = 'contract.html#' + data.address;
          } else {
            app.animate = true;
          }
        }
      });
        // `event` is the native DOM event
    }
  }
})

function allowDrop(ev) {
    ev.preventDefault();
}

function drop_handler(ev) {
  console.log("Drop");
  ev.preventDefault();

  var f = ev.dataTransfer.files[0];
  console.log ("the file is" , f);
  app.lastModified = f.lastModified;
  app.name = f.name;
  app.size = f.size;
  app.type = f.type;
  var reader = new FileReader();
  reader.onload = function(event) {
    //console.log('onload!',event);
    app.hash = sha3_256(event.target.result);
    console.log("hash is " + app.hash);
    
    

  };
  reader.readAsText(f);
}



