const RepoService = require('./service/repo_service').RepoService;

var myArgs = process.argv.slice(2);
if (myArgs.length >= 3 && (myArgs[0] == "push" || myArgs[0] == "pull")) {
    var method = myArgs[0];
    var tag = myArgs[1];
    var folder = myArgs[2];
} else {
    console.log("usage: node site_manager.js <push/pull> <site_name> <folder_name>");
    console.log("When push is used, it will save the <site_name> in the <folder_name> to the Bluzelle database.");
    console.log("When pull is used, it will load the <site_name> from Bluzelle database and store to the <folder_name>");
    process.exit();
}



(async () => {
  var repo = new RepoService();
  await repo.init();
  if (method == "push") {
    await repo.push(folder, tag);
    console.log(tag + " site in " + folder + " folder has been stored at the Bluzelle database.");
  }

  if (method == "pull") {
    await repo.pull(tag, folder);
    console.log(tag + " site has been read from the Bluzelle database. and store at folder " + folder);    
  }

})();

