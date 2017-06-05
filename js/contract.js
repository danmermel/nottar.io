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

var abi = [{
    constant: true,
    inputs: [],
    name: "name",
    outputs: [{
        name: "",
        type: "bytes32"
    }],
    payable: false,
    type: "function"
}, {
    constant: true,
    inputs: [],
    name: "hash",
    outputs: [{
        name: "",
        type: "bytes32"
    }],
    payable: false,
    type: "function"
}, {
    constant: true,
    inputs: [],
    name: "owner",
    outputs: [{
        name: "",
        type: "address"
    }],
    payable: false,
    type: "function"
}, {
    constant: true,
    inputs: [],
    name: "timestamp",
    outputs: [{
        name: "",
        type: "uint256"
    }],
    payable: false,
    type: "function"
}, {
    inputs: [{
        name: "_hash",
        type: "bytes32"
    }, {
        name: "_name",
        type: "bytes32"
    }],
    payable: true,
    type: "constructor"
}];

var app = new Vue({
  el: '#app',
  data: {
    hash:"",
    name:"",
    address:"",
    timestamp:"",
    error: ""
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
          app.hash = hextoascii(data);
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




