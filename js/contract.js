var web3= new Web3(Web3.givenProvider)

function hextoascii(str1) {  
  var hex  = str1.toString().replace(/0x/,'');  
  var str = '';  
  for (var n = 0; n < hex.length; n += 2) {
    var ascii = parseInt(hex.substr(n, 2), 16);
    if (ascii > 0 ) {
      str += String.fromCharCode(ascii);
    } else {
     break;
    }  
  }  
  return str;  
};

var app = new Vue({
  el: '#app',
  data: {
    abi: "",
    etherscanLink:"",
    hash:"",
    name:"",
    type:"",
    size: "",
    lastModified: "",
    address:"",
    timestamp:"",
    error: "",
    web3Missing: false,
    verified:false,
    droppedHash: "",
    dragging: false
  },
 mounted:function(){
   setTimeout(function() {
      //console.log('here', web3.eth.accounts, web3.eth.accounts.length);
      if (typeof window.ethereum === 'undefined') {
        app.web3Missing = true;
      } else {
        app.abi = JSON.stringify(abi);
        app.read_contract();
      }
       
   }, 1000);   
  },

 methods: {
    about: function (){
      window.location.href = "about.html";
    },
    contact: function (){
      window.location.href = "contact.html";
    },
    read_contract: async function () {
      // `this` inside methods points to the Vue instance

      console.log("in read function");
      if (window.location.hash && window.location.hash !== '#') {
        var address = window.location.hash.replace(/^#/,'');
        app.address = address;
        app.etherscanLink = "https://etherscan.io/address/" + address;
        var contract  = new web3.eth.Contract(abi, address);
        app.hash = await contract.methods.hash().call()
        app.name = hextoascii(await contract.methods.name().call())
	var timestamp = (await contract.methods.timestamp().call()).toString()
        timestamp = parseInt(timestamp)
        var ts = new Date(timestamp * 1000)
        app.timestamp = ts.toString()
        app.type  = hextoascii(await contract.methods.mime_type().call())
        app.size = (await contract.methods.size().call()).toString()
	timestamp = (await contract.methods.file_timestamp().call()).toString()
        timestamp = parseInt(timestamp)
        var ts = new Date(timestamp)
        app.lastModified = ts.toString()

      } else {
        app.error = "Missing contract address";
      }
    }
  }
})

function allowDrop(ev) {
  ev.preventDefault();
  app.dragging=true;
}

function dragout(ev) {
  console.log('drag out');
  app.dragging=false;
}

function verify_file(ev) {
  console.log("Verifying");
  ev.preventDefault();
  app.dragging=false;
  var f = ev.dataTransfer.files[0];
  console.log ("the file is" , f);
  var reader = new FileReader();
  reader.onload = function(event) {
    //console.log('onload!',event);
    app.droppedHash = web3.sha3(event.target.result);
    console.log("new hash is ", app.droppedHash);
    console.log("old hash is ", app.hash);
    if (app.droppedHash == app.hash){
      app.verified = true;
   } else {
     app.verified= false;
   }
    
    

  };
  reader.readAsText(f);
}




