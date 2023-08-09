// ==UserScript==
// @name        Copy install command for AUR helper
// @author      Bing AI, and my sleep deprived ass <- laine
// @version     1.0.1
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
    li.appendChild(container);
    ul.insertBefore(li, ul.firstChild);
}, false);
