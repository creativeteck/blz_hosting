# Censor-Resistant Web Hosting Services

Censor-Resistant Web Hosting Services using Bluzelle

# Install
```
npm install
```
Configuration can be found at config/default.json with the address, mnemonic and Bluzelle API url.

#  Demo web site

The public folder hold a static web site for demo purpose. You can start local node.js express web site:
```
npm start
```
and access the site using localhost:3000

# Save the web site to Bluzelle database
A tool is used to push the web site my_test_site in the public folder to the Bluzelle database:
```
node site_manager.js push my_test_site public
```
The my_test_site will be used as key, so that you can store multiple web site. The impelementation can be found at service/repo_service.js, where the whole site is tar and zipped. The hex string is stored at the Bluzelle database.

# Read the web site from Bluzelle database
You can pull the web site my_test_site from Bluzelle database to public1 folder
```
node site_manager.js pull my_test_site public1
```
In the service/repo_service.js, the site will be restored from the Bluzelle database. Stored at a temporary tgz file, and then extract to the folder specified.

# Update the web site
Modify the site at public1 folder, and then save it to the database again:
```
node site_manager.js push my_test_site public1
```
In the service/repo_service.js, it will check whether the web site exists or not. If it exists, the update will be used.


# Environment 
Tested at Ubuntu 20.04.1 LTS

[demo video](https://youtu.be/Xkig88HtVkI)
