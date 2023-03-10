const fs = require('fs');
const process = require('process');
const os = require('os');
console.log(os);

function tm(m, ...a) {
  if (m && a) {
    return m(...a);
  } else if (m && !a) {
    return m();
  }

  return `<err fetching>`;
}

function tn(o, os, propString, ...a) {
  function tm(m, ...a) {
    if (o[propString] && a) {
      return o[propString](...a);
    } else if (o) {
      return o[propString]();
    } else {
      return `<err fetching ${os}::${propString}>`;
    }
  }
}

function m() {
  return tn(os, 'os', 'machine');
}
let textf = ''; //yamlize
let json = {};

json.personal = {};
json.platform = {};
json.machine = {};
json.networking = {};
json.device = {};
switch (os.platform()) {
  case 'linux':
    json.personal.systemName = process.env.USERNAME || '<something went wrong>';
    json.platform.systemType = 'linux-' + m();
    break;
  case 'win32':
    json.personal.systemName = process.env.USERNAME || '<something went wrong>';
    json.platform.systemType = 'windows-' + m();
    break;
  case 'darwin':
    json.personal.systemName = process.env.USER || '<something went wrong>';
    json.platform.systemType = 'mac-' + m();
    break;
}

json.machine.cpu = os.cpus();
json.networking.wifiInterfaces = os.networkInterfaces();
json.platform.type = os.type();
json.personal.hostname = os.hostname();
json.device.endianStyle = os.endianness();

console.log(json);
