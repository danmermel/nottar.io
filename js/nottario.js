var bin = "0x606060405260405160408061029e833981016040528080519060200190919080519060200190919050505b6000620f424034101561003d5760006000fd5b33600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550816001816000191690555082600081600019169055504260038190555073a827177308ce5a395905aa077115f103343ad7dc90508073ffffffffffffffffffffffffffffffffffffffff166108fc349081150290604051809050600060405180830381858888f1935050505015156100f65760006000fd5b5b5050505b6101948061010a6000396000f30060606040526000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806306fdde031461005c57806309bd5a601461008a5780638da5cb5b146100b8578063b80777ea1461010a575bfe5b341561006457fe5b61006c610130565b60405180826000191660001916815260200191505060405180910390f35b341561009257fe5b61009a610136565b60405180826000191660001916815260200191505060405180910390f35b34156100c057fe5b6100c861013c565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b341561011257fe5b61011a610162565b6040518082815260200191505060405180910390f35b60015481565b60005481565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600354815600a165627a7a7230582053d7cd45b05f1327c6221b4bd1859b17d1a2db3b5ccaccbb4cfd116bebb9f27a0029";
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
    lastModified:"",
    size:"",
    type:"",
    error: "",
    web3Missing: false,
    loggedIn: true,
    animate: false
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
    create_contract: function () {
      // `this` inside methods points to the Vue instance
      console.log("creating contract, with", web3.eth.accounts[0]);
      var nottarioContract = web3.eth.contract(abi);
      var nottario =nottarioContract.new( "0x"+this.hash, this.name, {from:web3.eth.accounts[0], data: bin, gas: 3000000, value: 1000000}, function(err,data) {
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



