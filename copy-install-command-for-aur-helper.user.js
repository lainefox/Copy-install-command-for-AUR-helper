// ==UserScript==
// @name        Copy install command for AUR helper
// @author      Bing AI, and my sleep deprived ass <- laine
// @version     1.0.6
// @namespace   https://github.com/lainefox/Copy-install-command-for-AUR-helper
// @grant       GM.setClipboard
// @run-at      document-end
// @include     https://aur.archlinux.org/packages/*
// @include     http://aur.archlinux.org/packages/*
// ==/UserScript==

window.addEventListener("DOMContentLoaded", function() {
    var ul = document.getElementById("actionlist").getElementsByTagName("ul")[0];
    if (!ul) return;

    var pkgName = ul.getElementsByTagName("a")[0].href.match(/\/cgit\/aur\.git\/tree\/PKGBUILD\?h=([-_\w\d\.]+)/)[1];
    
    var li = document.createElement("li");
    var container = document.createElement("div");
    var link = document.createElement("a");
    var select = document.createElement("select");
    
    link.textContent = "Copy install command for ";
    link.href = "#";
    
    // Add additional AUR helpers to the list of package managers
    var packageManagers = ["ame", "aura", "aurman", "pacaur", "pakku", "paru", "pikaur", "trizen", "yay"];
    
    // Sort the list of package managers alphabetically
    packageManagers.sort();
    
    packageManagers.forEach(function(manager) {
        var option = document.createElement("option");
        option.value = manager;
        option.textContent = manager;
        select.appendChild(option);
    });
    
    // Restore the selected package manager from local storage
    var selectedManager = localStorage.getItem("selectedManager");
    if (selectedManager) {
        select.value = selectedManager;
    }
    
    // Save the selected package manager to local storage when the user selects an option from the dropdown
    select.addEventListener("change", function() {
        var selectedManager = select.value;
        localStorage.setItem("selectedManager", selectedManager);
    });
    
    link.addEventListener("click", function(event) {
        event.preventDefault();
        var selectedManager = select.value;
        var command = selectedManager + " -S " + pkgName;
        GM.setClipboard(command, "text");
    });
    
    container.appendChild(link);
    container.appendChild(select);
    
    // Create a new checkbox element for the Auto copy option
    var autoCopyCheckbox = document.createElement("input");
    autoCopyCheckbox.type = "checkbox";
    
    // Restore the Auto copy option from local storage
    var autoCopyEnabled = localStorage.getItem("autoCopyEnabled") === "true";
    autoCopyCheckbox.checked = autoCopyEnabled;
    
     // Automatically copy the command at page load if Auto copy is enabled
     if (autoCopyEnabled) {
         var selectedManager = select.value;
         var command = selectedManager + " -S " + pkgName;
         GM.setClipboard(command, "text");
     }
     
     // Save the Auto copy option to local storage when the user clicks on the checkbox
     autoCopyCheckbox.addEventListener("change", function() {
         localStorage.setItem("autoCopyEnabled", autoCopyCheckbox.checked);
         
         if (autoCopyCheckbox.checked) {
             // Automatically copy the command if Auto copy is enabled
             var selectedManager = select.value;
             var command = selectedManager + " -S " + pkgName;
             GM.setClipboard(command, "text");
         }
     });
     
     // Create a new label element for the Auto copy option
     var autoCopyLabel = document.createElement("label");
     autoCopyLabel.textContent = "Copy automatically";
  
  	 // Add an event listener to the label element
		 autoCopyLabel.addEventListener("click", function() {
         // Toggle the checked state of the checkbox
         autoCopyCheckbox.checked = !autoCopyCheckbox.checked;
    
         // Trigger the change event on the checkbox
         var event = new Event("change");
         autoCopyCheckbox.dispatchEvent(event);
         });

     
     // Append the Auto copy checkbox and label to the container element
     container.appendChild(document.createElement("br"));
     container.appendChild(autoCopyCheckbox);
     container.appendChild(autoCopyLabel);
     
     li.appendChild(container);
     
     ul.insertBefore(li, ul.firstChild);
     
     // Add some spacing at the end of the options added by this userscript
     container.style.marginBottom = "12px";
     
     // Fix the checkbox label being bold by setting its font weight to normal
     autoCopyLabel.style.fontWeight = "normal";
  
     // Get the computed value of the color property for the a selector
	 var linkColor = getComputedStyle(document.querySelector("a")).color;

     // Set the color of the label element
	 autoCopyLabel.style.color = linkColor;
}, false);
