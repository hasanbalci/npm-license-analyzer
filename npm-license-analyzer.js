var npmPackageName = "cytoscape-expand-collapse";
var npmPackageAddress = "https://www.npmjs.com/package/" + npmPackageName;

var npmAddress;

document.getElementById("packageSubmit").addEventListener("click", function(){
  document.getElementById("packageInfo").style.visibility = "hidden";
  document.getElementById("licenseAddress").style.visibility = "hidden";
  document.getElementById("dependencyInfo").style.visibility = "hidden";
  document.getElementById("dependencyTable").innerHTML = "";
  document.getElementById("peerDependencyTable").innerHTML = ""; 
  document.getElementById("devDependencyTable").innerHTML = "";
  
  if(document.getElementById("packageName").value) {
    npmAddress = "https://www.npmjs.com/package/" + document.getElementById("packageName").value;
    requestGeneralPackageData(npmAddress);
  }
});

var requestGeneralPackageData = function(npmAddress){
  
  fetch("https://cors-for-hb.herokuapp.com/" + npmAddress) // Call the fetch function passing the url of the API as a parameter
  .then(function(response) {
    return response.text();
  })
  .then(function(html) {
    readGeneralInfo(html);
  });
  
  
//  $.ajax({type: "get", url: "https://cors-anywhere.herokuapp.com/" + npmAddress, success: function(response) { 
//      readGeneralInfo(response);
//  }});
};

var readGeneralInfo = function(response){
  var parser = new DOMParser();
  var npmDummyHtml = parser.parseFromString(response, 'text/html');
  
  var currentLicense = npmDummyHtml.getElementsByClassName("package__sidebarText___n8Z-E fw6 mb3 mt2 truncate black-80 f4")[1].textContent;
  var githubAddress = npmDummyHtml.getElementsByClassName("package__sidebarLink___zE7yA package__sidebarText___n8Z-E fw6 mb3 mt2 truncate black-80 f4 link")[1].href;
  var packageJsonAddress = githubAddress.replace("github.com", "raw.githubusercontent.com") + "/master/package.json";
  
  var npmField = document.getElementById("npmAddress");
  npmField.href = npmAddress;
  npmField.text = npmAddress; 
  
  var githubField= document.getElementById("githubAddress");
  githubField.href = githubAddress;
  githubField.text = githubAddress;
  
  var licenseField = document.getElementById("currentLicense");
  licenseField.innerHTML = currentLicense;
  
  fetch("https://cors-for-hb.herokuapp.com/" + githubAddress)
  .then(function(response) {
    return response.text();
  })
  .then(function(html) {
    var parser = new DOMParser();
    var npmDummyHtml = parser.parseFromString(html, 'text/html');
    var existingLicense = npmDummyHtml.querySelectorAll('[itemprop="license"]')[0];
    var licenseAddressField = document.getElementById("licenseAddress");
    
    if(existingLicense !== undefined) {
      var licenseAddress = existingLicense.pathname; 
      licenseAddressField.style.visibility = "visible";
      licenseAddressField.href = "https://github.com" + licenseAddress;
      licenseAddressField.text = "link";
    }
    readPackageJson(packageJsonAddress);
    document.getElementById("packageInfo").style.visibility = "visible";
  });
};

var readPackageJson = function(packageJsonAddress) {
  fetch("https://cors-for-hb.herokuapp.com/" + packageJsonAddress) // Call the fetch function passing the url of the API as a parameter
  .then(function(response) {
    return response.json();
  })
  .then(function(json) {
    var packageJson = json;
    if(typeof packageJson.dependencies != "undefined" ) {
      parseAndShowDependencyInfo(packageJson.dependencies, "dependencyTable");
    }
    if(typeof packageJson.peerDependencies != "undefined" ) {
      parseAndShowDependencyInfo(packageJson.peerDependencies, "peerDependencyTable");
    }
    if(typeof packageJson.devDependencies != "undefined" ) {
      parseAndShowDependencyInfo(packageJson.devDependencies, "devDependencyTable");
    }
  });
};

var parseAndShowDependencyInfo = function(dependencyObject, tableName) {
  document.getElementById(tableName).innerHTML = ""; 
  var dependencyField = document.getElementById(tableName).innerHTML; 
  dependencyField += "<tr class='title'><td style='width:25%'>" + tableName.replace("yTable", "ies") + 
                    "</td><td style='width:15%'>License</td><td style='width:60%'>Github Address</td></b></tr>";
  
  for (var key in dependencyObject) {    
    var packageAddress = "https://cors-for-hb.herokuapp.com/https://www.npmjs.com/package/" + key;
    fetch(packageAddress) // Call the fetch function passing the url of the API as a parameter
    .then(function(response) {
      return response.text();
    })
    .then(function(html) {
      var parser = new DOMParser();
      var npmDummyHtml = parser.parseFromString(html, 'text/html');

      var packageName = npmDummyHtml.getElementsByClassName("package__name___dAyWc truncate flex-auto")[0].textContent;
      var currentLicense = npmDummyHtml.getElementsByClassName("package__sidebarText___n8Z-E fw6 mb3 mt2 truncate black-80 f4")[1].textContent;
      var githubAddress = npmDummyHtml.getElementsByClassName("package__sidebarLink___zE7yA package__sidebarText___n8Z-E fw6 mb3 mt2 truncate black-80 f4 link")[1].href;
        
      dependencyField += "<tr><td>" + packageName + "</td><td>" + currentLicense + "</td><td><a target='_blank' href='" + githubAddress + "'>" + githubAddress + "</td></tr>";
      document.getElementById(tableName).innerHTML = dependencyField;
      document.getElementById("dependencyInfo").style.visibility = "visible";
    });
  }    
};

