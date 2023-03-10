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
  if (typeof o[propString] == 'undefined') {
    return `<err fetching ${os}::${propString}>`;
  }
  if (typeof o[propString] == 'function') {
    if (o[propString] && a) {
      return o[propString](...a);
    } else {
      return o[propString]();
    }
  } else {
    return o[propString];
  }
}

function m() {
  return tn(os, 'os', 'machine');
}
let textf = ''; //write human readable text
let json = {};

json.personal = {};
json.platform = {};
json.machine = {};
json.networking = {};
json.device = {};
switch (os.platform()) {
  case 'linux':
    json.personal.systemName = tn(process.env, 'ENV', 'USERNAME');
    break;
  case 'win32':
    json.personal.systemName = tn(process.env, 'ENV', 'USERNAME');
    break;
  case 'darwin':
    json.personal.systemName = tn(process.env, 'ENV', 'USER');
    break;
}

json.platform.system = tn(os, 'os', 'platform');
json.platform.machine = tn(os, 'os', 'machine');

json.machine.cpu = os.cpus();
json.networking.wifiInterfaces = os.networkInterfaces();
json.platform.type = os.type();
json.personal.hostname = os.hostname();
json.device.endianStyle = os.endianness();
json.device.arch = tn(os, 'os', 'arch');
json.device.release = tn(os, 'os', 'release');
json.device.env = tn(process, 'process', 'env');

textf += 'depl-osint human readable text response\n\n';

function ne(s) {
  if (typeof s != 'string') return true;
  return !s.startsWith('<err fetching');
}
if (ne(json.personal.systemName) && ne(json.personal.hostname)) {
  textf += `The system's name is ${json.personal.systemName} and its hostname is ${json.personal.hostname}. `;
}

if (ne(json.personal.hostname) && !ne(json.personal.systemName)) {
  textf += `The system's hostname is ${json.personal.hostname}; The username is unresolvable. `;
}
if (ne(json.platform.system)) {
  textf += `The system is a ${json.platform.type} system. `;
}

if (ne(json.device.arch)) {
  textf += `The system arch is ${json.device.arch}. `;
}

if (ne(json.machine.cpu)) {
  textf += `The system has ${json.machine.cpu.length} cpu cores`;
  if (ne(json.networking.wifiInterfaces)) {
    textf += ` and ${
      Object.keys(json.networking.wifiInterfaces).length
    } wifi interfaces`;
  }
  textf += '.';
}
console.log(textf);
