
  function digestMessage(message) {
    const msgUint8 = new TextEncoder().encode(message);  
    console.log(msgUint8);                         // encode as (utf-8) Uint8Array
    return crypto.subtle.digest('SHA-256', msgUint8).then(hashBuffer=>{
      
               // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer));   
    console.log(hashArray);                  // convert buffer to byte array
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
    return hashHex;
    });
  }
  
  digestMessage('12345678').then(digestHex=>{
    console.log(digestHex); 
  });
 



  
  // from https://developers.google.com/web/updates/2012/06/How-to-convert-ArrayBuffer-to-and-from-String
  function str2ab(str) {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return bufView;
  }

  const pemEncodedKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAy3Xo3U13dc+xojwQYWoJLCbOQ5fOVY8LlnqcJm1W1BFtxIhOAJWohiHuIRMctv7dzx47TLlmARSKvTRjd0dF92jx/xY20Lz+DXp8YL5yUWAFgA3XkO3LSJgEOex10NB8jfkmgSb7QIudTVvbbUDfd5fwIBmCtaCwWx7NyeWWDb7A9cFxj7EjRdrDaK3ux/ToMLHFXVLqSL341TkCf4ZQoz96RFPUGPPLOfvN0x66CM1PQCkdhzjE6U5XGE964ZkkYUPPsy6Dcie4obhW4vDjgUmLzv0z7UD010RLIneUgDE2FqBfY/C+uWigNPBPkkQ+Bv/UigS6dHqTCVeD5wgyBQIDAQAB
-----END PUBLIC KEY-----`;

  function importRsaKey(pem) {
    // fetch the part of the PEM string between header and footer
    const pemHeader = "-----BEGIN PUBLIC KEY-----";
    const pemFooter = "-----END PUBLIC KEY-----";
    const pemContents = pem.substring(pemHeader.length, pem.length - pemFooter.length-1).split('\n').join('');
    console.log(pemContents);
    // base64 decode the string to get the binary data
    const binaryDerString = window.atob(pemContents);
    // convert from a binary string to an ArrayBuffer
    const binaryDer = str2ab(binaryDerString);
    console.log(binaryDer);
    return window.crypto.subtle.importKey(
      "spki",
      binaryDer,
      {
        name: "RSA-OAEP",
        hash: "SHA-256",
        iv:'76e57bdf48ae51055f9a37d3a8da1bc1'
      },
      true,
      ["encrypt"]
    );
  }

  function getMessageEncoding() {
   // const messageBox = document.querySelector(".rsa-oaep #message");
   // let message = messageBox.value;
    let enc = new TextEncoder();
    return enc.encode('message');
  }

  /*function str2ab(str) {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return bufView;
  }*/
  
  function encryptMessage(publicKey) {
    let encoded = str2ab('message');//getMessageEncoding();
    console.log(publicKey);
    //iv = window.crypto.getRandomValues(new Uint8Array(16));
    return window.crypto.subtle.encrypt(
      {
        name: "RSA-OAEP",
        iv:'76e57bdf48ae51055f9a37d3a8da1bc1'
      },
      publicKey,
      encoded
    );
  }

  function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
  }

  fetch('http:/localhost:4040/authService/getPublicKey').then(res=>{return res.json();})
  .then(key=>{console.log(key); return importRsaKey(key);})
  .then(key=> { return encryptMessage(key);}).then(buf=>{
    console.log(ab2str(buf));
    return btoa(ab2str(buf));
  }).then(res=>{
    fetch('http:/localhost:4040/authService/sendCrypted?msg='+res);  
  })