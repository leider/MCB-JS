const fs = require("fs");

const workingdir = (process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE) + "/MCB/data";
const addressesPath = workingdir + "/addresses.json";
const treffenPath = workingdir + "/treffen.json";

function allAddresses(callback) {
  fs.readFile(addressesPath, (err, data) => {
    callback(err, JSON.parse(data));
  });
}

function allTreffen(callback) {
  fs.readFile(treffenPath, (err, data) => {
    callback(err, JSON.parse(data));
  });
}

function findDataWithId(all, id) {
  return all.find(d => d.id === id);
}

function updateOrInsertData(allData, data, path, callback) {
  if (!data.id) {
    data.id =
      allData
        .map(d => d.id)
        .sort((a, b) => a - b)
        .pop() + 1;
  }

  const existingData = findDataWithId(allData, data.id);
  const index = allData.indexOf(existingData);
  allData.splice(index === -1 ? allData.length : index, 1, data);

  const json = JSON.stringify(allData);
  const diffJson = JSON.stringify({ old: existingData, new: data });
  fs.writeFile(`${path.replace(".json", "")}.id=${data.id}-${new Date().toISOString()}.json`, diffJson, err => {
    if (err) {
      callback(err);
    }
    const resultJSON = JSON.stringify({ data: allData, id: data.id });
    fs.writeFile(path, json, err1 => callback(err1, resultJSON));
  });
}

function deleteData(allData, dataId, path, callback) {
  const index = allData.indexOf(findDataWithId(allData, dataId));
  if (index > -1) {
    allData.splice(index, 1);
  }
  const json = JSON.stringify(allData);
  // eslint-disable-next-line no-sync
  fs.renameSync(path, path + Date.now());
  fs.writeFile(path, json, err1 => callback(err1, json));
}

function saveAddress(address, callback) {
  allAddresses((err, addresses) => {
    if (err) {
      return callback(err);
    }
    updateOrInsertData(addresses, address, addressesPath, callback);
  });
}

function saveTreffen(treffen, callback) {
  allTreffen((err, alleTreffen) => {
    if (err) {
      return callback(err);
    }
    updateOrInsertData(alleTreffen, treffen, treffenPath, callback);
  });
}
function deleteAddress(id, callback) {
  allAddresses((err, addresses) => {
    if (err) {
      return callback(err);
    }
    deleteData(addresses, id, addressesPath, callback);
  });
}

function deleteTreffen(id, callback) {
  allTreffen((err, alleTreffen) => {
    if (err) {
      return callback(err);
    }
    deleteData(alleTreffen, id, treffenPath, callback);
  });
}

module.exports = {
  allAddresses,
  allTreffen,
  saveAddress,
  saveTreffen,
  deleteAddress,
  deleteTreffen
};
