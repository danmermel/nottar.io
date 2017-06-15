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
    hash:"",
    name:"",
    address:"",
    timestamp:"",
    error: "",
    verified:false
  },
  mounted:function(){
    setTimeout(this.read_contract,1000)
  },

  methods: {
    read_contract: function () {
      // `this` inside methods points to the Vue instance

      console.log("in read function");
      if (window.location.hash && window.location.hash !== '#') {
        var address = window.location.hash.replace(/^#/,'');

        var contract  = web3.eth.contract(abi).at(address);
        contract.hash(function(err,data){
          console.log(err,data);
          app.hash = data.replace(/^0x/,"");
        });
        contract.name(function(err,data){
          console.log(err,data);
          app.name = hextoascii(data);
        });
        contract.timestamp(function(err,data){
          var timestamp = parseInt(data.toString());
          var ts = new Date(timestamp * 1000);
          app.timestamp = ts.toString();

          console.log('timestamp', data, typeof data);
        });


      } else {
        app.error = "Missing contract address";
      }
    }
  }
})

function allowDrop(ev) {
    ev.preventDefault();
}

function verify_file(ev) {
  console.log("Verifying");
  ev.preventDefault();

  var f = ev.dataTransfer.files[0];
  console.log ("the file is" , f);
  var reader = new FileReader();
  reader.onload = function(event) {
    //console.log('onload!',event);
    var hash = sha3_256(event.target.result);
    console.log("new hash is " + hash);
    if (hash == app.hash){
      app.verified = true;
   } else {
     app.verified= false;
   }
    
    

  };
  reader.readAsText(f);
}




