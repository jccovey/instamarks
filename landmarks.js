/* Bookmarklet code
javascript:function%20loadScript(scriptURL)%20{%20var%20scriptElem%20=%20document.createElement('SCRIPT');%20scriptElem.setAttribute('language',%20'JavaScript');%20scriptElem.setAttribute('src',%20scriptURL);%20document.body.appendChild(scriptElem);}%20loadScript('http://fsavard.com/code/landmarks.js');
*/

function loadCss(url){
    var headID = document.getElementsByTagName("head")[0];
    var cssNode = document.createElement('link');
    cssNode.type = 'text/css';
    cssNode.rel = 'stylesheet';
    cssNode.href = url;
    cssNode.media = 'screen';
    headID.appendChild(cssNode);
}

// Taken from http://stackoverflow.com/questions/756382/bookmarklet-wait-until-javascript-is-loaded
function loadScript(url, callback)
{
    var head = document.getElementsByTagName("head")[0];
    var script = document.createElement("script");
    script.src = url;

    // Attach handlers for all browsers
    var done = false;
    script.onload = script.onreadystatechange = function()
    {
        if( !done && ( !this.readyState
            || this.readyState == "loaded"
            || this.readyState == "complete") )
            {
            done = true;

            // Continue your code
            callback();

            // Handle memory leak in IE
            script.onload = script.onreadystatechange = null;
            head.removeChild( script );
        }
    };

    head.appendChild(script);
}

var scriptUrls = ['http://www.fsavard.com/code/speedread/jquery.js','http://www.fsavard.com/code/uuid.js'];
function loadScripts(lastCallback, nextId){
    if(!nextId) nextId = 0;
    if(nextId >= scriptUrls.length){
        lastCallback(); return;
    }
    loadScript(scriptUrls[nextId], function(){
        loadScripts(lastCallback, nextId+1);
    });
}

// Taken from http://www.codetoad.com/javascript_get_selected_text.asp
function getSelText(){
    var txt = '';
    if (window.getSelection){
        return window.getSelection();
    }else if (document.getSelection){
        return document.getSelection();
    }else if (document.selection){
        return document.selection.createRange().text;
    }else
        return;
}

// adapted from http://snipplr.com/view.php?codeview&id=10912
function getSelRange() {
    var userSelection;
    if (window.getSelection) {
        // W3C Ranges
        userSelection = window.getSelection ();

        if(!userSelection) return '';

        // Get the range:
        if (userSelection.getRangeAt)
            var range = userSelection.getRangeAt (0);
        else {
            var range = document.createRange ();
            range.setStart (userSelection.anchorNode, userSelection.anchorOffset);
            range.setEnd (userSelection.focusNode, userSelection.focusOffset);
        }

        return range;
    } else if (document.selection) {
        // Explorer selection, return the HTML
        return document.selection.createRange ();
    } else {
        return undefined;
    }
}

// Adapted fom http://www.mirrors.docunext.com/cgi-bin/jquery-hhh333-plugins/view/trunk/jqueryRte/jquery.rte.js?rev=4
function insertNodeAtRangeStart(node,range){
    if(range.insertNode){ // normal way
        range.insertNode(node);
    }else{ // ugly ie hack
        var tmpParent = this.createElement('span');
        tmpParent.appendChild(node);
        r.collapse();
        r.pasteHTML(tmpParent.innerHTML);
    }
}

function newLandmark(){
    var range = getSelRange();
    if(!range){
        alert("Browser not supported");
        return;
    }
    var title = ''+getSelText();
    if(title.length == 0){
        alert("You first need to select some text to serve as landmark.");
        return;
    }
    if(title.length > 20){
        title = title.substr(0,20) + '...';
    }

    var uuid = UUID.generate('v4');
    var landmark = jQuery('<a/>').attr('name',uuid);
    insertNodeAtRangeStart(landmark.get(0), range);

    var listitem = jQuery('<li/>');
    jQuery('#landmarks_list').append(listitem);
    var anchorlink = jQuery('<a href="#'+uuid+'">'+title+'</a>');
    listitem.append(anchorlink);
}

function proceed(){
    var htmlToAdd =
    '<div id="landmarks_controls"><input type="button" onclick="newLandmark();" value="New landmark from selection"/></div>'+
    '<ul id="landmarks_list">'+
    '</ul>';

    ob = jQuery('<div/>')
    .html(htmlToAdd)
    .attr('id','landmarks_container')
    .css({
        'position':'fixed',
        'right':'5px',
        'top':'5px',
        'width':'330px',
        'background-color':'#ddd',
        'padding':'5px',
        'border':'1px solid black'
    });

    jQuery('body').append(ob);
}

loadScripts(proceed, 0);
